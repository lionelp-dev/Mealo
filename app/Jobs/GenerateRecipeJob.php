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

    public int $tries = 3;

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
}
