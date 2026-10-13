<?php

namespace App\Actions\Recipes;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

final class RecipeDiscoveryJobState
{
    private const EXPIRES_AFTER_MINUTES = 30;

    /**
     * @return array{status: 'queued'|'processing'|'completed'|'failed', pool?: array{recipes: array<int, array<string, mixed>>, failedRecipeCount: int}, error?: string}|null
     */
    public function forUser(string $discoveryId, int $userId): ?array
    {
        $state = Cache::get($this->cacheKey($discoveryId));

        if (! is_array($state) || ($state['user_id'] ?? null) !== $userId) {
            return null;
        }

        unset($state['user_id']);

        /** @var array{status: 'queued'|'processing'|'completed'|'failed', pool?: array{recipes: array<int, array<string, mixed>>, failedRecipeCount: int}, error?: string} $state */
        return $state;
    }

    public function queue(int $userId): string
    {
        $discoveryId = (string) Str::uuid();

        $this->put($discoveryId, [
            'user_id' => $userId,
            'status' => 'queued',
        ]);

        return $discoveryId;
    }

    public function markProcessing(string $discoveryId, int $userId): void
    {
        $this->put($discoveryId, [
            'user_id' => $userId,
            'status' => 'processing',
        ]);
    }

    /**
     * @param  array{recipes: array<int, array<string, mixed>>, failedRecipeCount: int}  $pool
     */
    public function complete(string $discoveryId, int $userId, array $pool): void
    {
        $this->put($discoveryId, [
            'user_id' => $userId,
            'status' => 'completed',
            'pool' => $pool,
        ]);
    }

    public function fail(string $discoveryId, int $userId): void
    {
        $this->put($discoveryId, [
            'user_id' => $userId,
            'status' => 'failed',
            'error' => 'La génération des recettes a échoué. Réessayez dans quelques instants.',
        ]);
    }

    /**
     * @param  array{user_id: int, status: 'queued'|'processing'|'completed'|'failed', pool?: array{recipes: array<int, array<string, mixed>>, failedRecipeCount: int}, error?: string}  $state
     */
    private function put(string $discoveryId, array $state): void
    {
        Cache::put(
            $this->cacheKey($discoveryId),
            $state,
            now()->addMinutes(self::EXPIRES_AFTER_MINUTES),
        );
    }

    private function cacheKey(string $discoveryId): string
    {
        return "recipe-discovery:{$discoveryId}";
    }
}
