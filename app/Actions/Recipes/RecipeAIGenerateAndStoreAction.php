<?php

namespace App\Actions\Recipes;

use App\Data\Requests\Recipe\RecipeAIGenerationRequestData;
use App\Data\Requests\Recipe\RecipeStoreRequestData;
use App\Models\Recipe;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Throwable;

class RecipeAIGenerateAndStoreAction
{
    public function __construct(
        private readonly RecipeAIGenerationAction $recipeAIGenerationAction,
        private readonly RecipeStoreAction $recipeStoreAction,
        private readonly RecipeImageAIGenerationAction $recipeImageAIGenerationAction,
        private readonly RecipeUploadImageAction $recipeUploadImageAction,
    ) {}

    /**
     * Generate one or more recipes from the AI service and persist them.
     *
     * @return Collection<int, Recipe>
     */
    public function execute(User $user, RecipeAIGenerationRequestData $data): Collection
    {
        $generated = $this->recipeAIGenerationAction->generate($data);

        return collect($generated)->map(
            fn (RecipeStoreRequestData $recipeData): Recipe => $this->store($user, $recipeData, $data->image_generation ?? false)
        );
    }

    private function store(User $user, RecipeStoreRequestData $recipeData, bool $withImage): Recipe
    {
        $recipe = $this->recipeStoreAction->execute($user, $recipeData);

        if ($withImage) {
            $this->attachGeneratedImage($recipe, $recipeData);
        }

        return $recipe;
    }

    private function attachGeneratedImage(Recipe $recipe, RecipeStoreRequestData $recipeData): void
    {
        try {
            $prompt = $recipeData->name
                .'with'.json_encode($recipeData->ingredients)
                .'recipe steps'.json_encode($recipeData->steps);

            $dataUrl = $this->recipeImageAIGenerationAction->execute($prompt);

            ($this->recipeUploadImageAction)->fromDataUrl($recipe, $dataUrl);
            $recipe->refresh();
        } catch (Throwable $e) {
            // Image generation is best-effort: keep the recipe even if it fails.
            Log::warning('Recipe AI image generation failed', [
                'recipe_id' => $recipe->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
