<?php

namespace App\Actions\Recipes;

use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;

class RecipeGenerationSessionState
{
    private const REQUESTED_AT_KEY = 'recipe_generation_requested_at';

    private const BASELINE_COUNT_KEY = 'recipe_generation_baseline_count';

    private const REQUESTED_COUNT_KEY = 'recipe_generation_requested_count';

    private const EXPIRES_AFTER_MINUTES = 5;

    /**
     * @return array{generating: bool, count: int}|null
     */
    public function toInertiaProp(Request $request, ?User $user): ?array
    {
        if (! $user instanceof User) {
            return null;
        }

        $state = $this->readState($request);

        if ($state === null) {
            return null;
        }

        if ($this->isExpired($state['requested_at'])) {
            $this->clear($request);

            return null;
        }

        $remainingCount = $this->remainingCount(
            $state['baseline_count'],
            $state['requested_count'],
            $user->recipes()->count(),
        );

        if ($remainingCount === 0) {
            $this->clear($request);

            return ['generating' => false, 'count' => 0];
        }

        return ['generating' => true, 'count' => $remainingCount];
    }

    public function trackQueuedGeneration(Request $request, User $user, int $requestedCount): void
    {
        $currentRecipeCount = $user->recipes()->count();
        $pendingCount = $this->pendingCount($request, $currentRecipeCount);

        $request->session()->put([
            self::REQUESTED_AT_KEY => now()->toISOString(),
            self::BASELINE_COUNT_KEY => $currentRecipeCount,
            self::REQUESTED_COUNT_KEY => $pendingCount + $requestedCount,
        ]);
    }

    private function pendingCount(Request $request, int $currentRecipeCount): int
    {
        $state = $this->readState($request);

        if ($state === null || $this->isExpired($state['requested_at'])) {
            return 0;
        }

        return $this->remainingCount(
            $state['baseline_count'],
            $state['requested_count'],
            $currentRecipeCount,
        );
    }

    /**
     * @return array{requested_at: string, baseline_count: int, requested_count: int}|null
     */
    private function readState(Request $request): ?array
    {
        $requestedAtRaw = $request->session()->get(self::REQUESTED_AT_KEY);
        $baselineCount = $request->session()->get(self::BASELINE_COUNT_KEY);
        $requestedCount = $request->session()->get(self::REQUESTED_COUNT_KEY);

        if (! is_string($requestedAtRaw) || ! is_numeric($baselineCount) || ! is_numeric($requestedCount)) {
            return null;
        }

        return [
            'requested_at' => $requestedAtRaw,
            'baseline_count' => (int) $baselineCount,
            'requested_count' => max(1, (int) $requestedCount),
        ];
    }

    private function remainingCount(int $baselineCount, int $requestedCount, int $currentRecipeCount): int
    {
        return max(0, ($baselineCount + $requestedCount) - $currentRecipeCount);
    }

    private function isExpired(string $requestedAt): bool
    {
        return CarbonImmutable::parse($requestedAt)->addMinutes(self::EXPIRES_AFTER_MINUTES)->isPast();
    }

    private function clear(Request $request): void
    {
        $request->session()->forget([
            self::REQUESTED_AT_KEY,
            self::BASELINE_COUNT_KEY,
            self::REQUESTED_COUNT_KEY,
        ]);
    }
}
