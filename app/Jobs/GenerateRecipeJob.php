<?php

namespace App\Jobs;

use App\Actions\Recipes\RecipeAIGenerationAction;
use App\Actions\Recipes\RecipeStoreAction;
use App\Data\Requests\Recipe\RecipeAIGenerationRequestData;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GenerateRecipeJob implements ShouldQueue
{
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public int $tries = 0;

    public int $maxExceptions = 3;

    public int $timeout = 120;

    public int $backoff = 30;

    public function __construct(
        public int $userId,
        public string $prompt,
        public int $recipeNumber
    ) {
        $this->onQueue('recipes');
    }

    public function handle(
        RecipeAIGenerationAction $recipeAIGenerationAction,
        RecipeStoreAction $recipeStoreAction
    ): void {
        try {
            echo "🔄 Generating recipe #{$this->recipeNumber}: {$this->prompt}\n";

            if ($this->missingOpenRouterApiKey()) {
                $delay = (int) config('recipe-queue.missing_api_key_release_delay', 300);

                echo "⏸️ OPEN_ROUTER_API_KEY is missing. Recipe #{$this->recipeNumber} released for {$delay}s.\n";
                Log::warning('Recipe generation delayed because OPEN_ROUTER_API_KEY is missing.', [
                    'prompt' => $this->prompt,
                    'recipe_number' => $this->recipeNumber,
                    'release_delay' => $delay,
                ]);

                $this->release($delay);

                return;
            }

            // Generate recipe data from AI
            $generateRecipeData = RecipeAIGenerationRequestData::validateAndCreate(['prompt' => $this->prompt]);
            $recipeStoreRequestData = $recipeAIGenerationAction->execute($generateRecipeData);

            $user = User::query()->find($this->userId);

            if (! $user) {
                throw new \Exception('User not found');
            }
            // Store recipe with all relations
            $recipe = $recipeStoreAction->execute($user, $recipeStoreRequestData);

            echo "✅ Recipe #{$this->recipeNumber} created: {$recipe->name}\n";
            Log::info("Recipe generated via queue: {$recipe->name}");

        } catch (\Exception $e) {
            echo "❌ Failed recipe #{$this->recipeNumber}: {$e->getMessage()}\n";
            Log::error("Recipe generation failed: {$this->prompt} - {$e->getMessage()}");
            throw $e;
        }
    }

    private function missingOpenRouterApiKey(): bool
    {
        $apiKey = config('services.openai.api_key');

        return blank($apiKey) || $apiKey === 'sk-or-v1-fake-key-for-testing';
    }
}
