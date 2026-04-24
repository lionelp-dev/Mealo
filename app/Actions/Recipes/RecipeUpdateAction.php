<?php

namespace App\Actions\Recipes;

use App\Data\Requests\Recipe\RecipeUpdateRequestData;
use App\Models\Recipe;
use Illuminate\Support\Facades\DB;

class RecipeUpdateAction
{
    public function __construct(
        private RecipeSyncIngredientsAction $syncIngredients,
        private RecipeSyncTagsAction $syncTags,
        private RecipeSyncMealTimesAction $syncMealTimes,
        private RecipeSyncStepsAction $syncSteps,
        private RecipeUploadImageAction $uploadImage,
        private RecipeImageDeleteAction $recipeImageDeleteAction,
    ) {}

    /**
     * Update an existing recipe with all relations.
     */
    public function execute(
        Recipe $recipe,
        RecipeUpdateRequestData $recipeData,
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
            ($this->recipeImageDeleteAction)($recipe);
        }

        return $recipe;
    }
}
