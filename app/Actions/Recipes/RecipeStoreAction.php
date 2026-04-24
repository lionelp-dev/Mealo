<?php

namespace App\Actions\Recipes;

use App\Data\Requests\Recipe\RecipeStoreRequestData;
use App\Models\Recipe;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class RecipeStoreAction
{
    public function __construct(
        private RecipeSyncIngredientsAction $syncIngredients,
        private RecipeSyncTagsAction $syncTags,
        private RecipeSyncMealTimesAction $syncMealTimes,
        private RecipeSyncStepsAction $syncSteps,
        private RecipeUploadImageAction $uploadImage,
    ) {}

    /**
     * Create a new recipe with all relations.
     */
    public function execute(User $user, RecipeStoreRequestData $recipeData): Recipe
    {
        return DB::transaction(function () use ($user, $recipeData): Recipe {

            $recipe = Recipe::query()->create([
                'user_id' => $user->id,
                ...$recipeData->except('image')->transform(),
            ]);

            ($this->syncIngredients)($recipe, $recipeData->ingredients);

            ($this->syncTags)($recipe, $recipeData->tags);

            ($this->syncMealTimes)($recipe, $recipeData->meal_times);

            ($this->syncSteps)($recipe, $recipeData->steps);

            if ($recipeData->image) {
                ($this->uploadImage)($recipe, $recipeData->image);
                $recipe->refresh();
            }

            return $recipe;
        });

    }
}
