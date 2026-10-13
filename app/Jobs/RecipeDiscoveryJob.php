<?php

namespace App\Jobs;

use App\Actions\Recipes\RecipeDiscoveryJobState;
use App\Clients\Ai\RecipeAIClient;
use App\Data\Requests\Recipe\RecipeDiscoveryRequestData;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Throwable;

class RecipeDiscoveryJob implements ShouldQueue
{
    public const QUEUE = RecipeAIGenerationJob::QUEUE;

    public int $timeout = 300;

    public int $tries = 1;

    public bool $failOnTimeout = true;

    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public function __construct(
        public string $discoveryId,
        public int $userId,
        public RecipeDiscoveryRequestData $recipeDiscoveryRequestData,
    ) {}

    public function handle(
        RecipeAIClient $recipeAIClient,
        RecipeDiscoveryJobState $recipeDiscoveryJobState,
    ): void {
        $recipeDiscoveryJobState->markProcessing($this->discoveryId, $this->userId);

        $user = User::query()->find($this->userId);

        if (! $user instanceof User) {
            throw new \RuntimeException('The user for the recipe discovery job no longer exists.');
        }

        $recipeDiscoveryJobState->complete(
            $this->discoveryId,
            $this->userId,
            $recipeAIClient->discover($this->recipeDiscoveryRequestData, $user),
        );
    }

    public function failed(Throwable $exception): void
    {
        app(RecipeDiscoveryJobState::class)->fail($this->discoveryId, $this->userId);

        Log::error('Queued recipe discovery failed.', [
            'discovery_id' => $this->discoveryId,
            'user_id' => $this->userId,
            'exception' => $exception,
        ]);
    }
}
