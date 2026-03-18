<?php

namespace App\Actions\Recipes;

use App\Data\Recipe\Requests\UpdateRecipeRequestData;
use App\Models\Recipe;
use Illuminate\Support\Facades\DB;

class UpdateRecipeAction
{
    public function __construct(
        private SyncRecipeIngredientsAction $syncIngredients,
        private SyncRecipeTagsAction $syncTags,
        private SyncRecipeMealTimesAction $syncMealTimes,
        private SyncRecipeStepsAction $syncSteps,
        private UploadRecipeImageAction $uploadImage,
        private DeleteRecipeImageAction $deleteImage,
    ) {}

    /**
     * Update an existing recipe with all relations.
     */
    public function execute(
        Recipe $recipe,
        UpdateRecipeRequestData $recipeData,
    ): Recipe {
        DB::transaction(function () use ($recipe, $recipeData) {
            $recipe->update([
                'name' => $recipeData->name,
                'description' => $recipeData->description,
                'serving_size' => $recipeData->serving_size,
                'preparation_time' => $recipeData->preparation_time,
                'cooking_time' => $recipeData->cooking_time,
            ]);

            ($this->syncIngredients)($recipe, $recipeData->ingredients);
            ($this->syncTags)($recipe, $recipeData->tags);
            ($this->syncMealTimes)($recipe, $recipeData->meal_times);
            ($this->syncSteps)($recipe, $recipeData->steps);
        });

        if ($recipeData->image) {
            ($this->uploadImage)($recipe, $recipeData->image);
        } else {
            ($this->deleteImage)($recipe);
        }

        return $recipe;
    }
}
