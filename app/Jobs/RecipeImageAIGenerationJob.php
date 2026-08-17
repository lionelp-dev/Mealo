<?php

namespace App\Jobs;

use App\Actions\Recipes\RecipeImageAIGenerationAction;
use App\Actions\Recipes\RecipeUploadImageAction;
use App\Models\Recipe;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class RecipeImageAIGenerationJob implements ShouldQueue
{
    public const QUEUE = 'recipes-images-ai-generation';

    use Dispatchable;
    use Queueable;

    /**
     * @param  array<int, string>  $recipeIds
     */
    public function __construct(
        public int $userId,
        public array $recipeIds,
    ) {}

    public function handle(
        RecipeImageAIGenerationAction $recipeImageAIGenerationAction,
        RecipeUploadImageAction $recipeUploadImageAction,
    ): void {
        $recipes = Recipe::query()
            ->where('user_id', $this->userId)
            ->whereIn('id', $this->recipeIds)
            ->with(['ingredients', 'steps'])
            ->get();

        foreach ($recipes as $recipe) {
            if ($recipe->image_path) {
                continue;
            }

            try {
                $base64Image = $recipeImageAIGenerationAction->execute(
                    $this->imagePrompt($recipe)
                );

                $recipeUploadImageAction->fromDataUrl($recipe, $base64Image);
            } catch (\Throwable $e) {
                Log::warning('Recipe image generation failed for queued recipe.', [
                    'recipe_id' => $recipe->id,
                    'recipe_name' => $recipe->name,
                    'user_id' => $this->userId,
                    'error' => $e->getMessage(),
                ]);
            }
        }
    }

    private function imagePrompt(Recipe $recipe): string
    {
        $ingredients = $recipe->ingredients
            ->map(fn ($ingredient): string => trim("{$ingredient->pivot->quantity} {$ingredient->pivot->unit} {$ingredient->name}"))
            ->implode(', ');

        $steps = $recipe->steps
            ->sortBy('order')
            ->pluck('description')
            ->implode(' ');

        return "{$recipe->name} with {$ingredients}. Recipe steps: {$steps}";
    }
}
