<?php

namespace App\Actions\Recipes;

use App\Data\Requests\Recipe\StoreRecipeRequestData;
use App\Models\Recipe;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class StoreRecipeAction
{
    public function __construct(
        private SyncRecipeIngredientsAction $syncIngredients,
        private SyncRecipeTagsAction $syncTags,
        private SyncRecipeMealTimesAction $syncMealTimes,
        private SyncRecipeStepsAction $syncSteps,
        private UploadRecipeImageAction $uploadImage,
    ) {}

    /**
     * Create a new recipe with all relations.
     */
    public function execute(User $user, StoreRecipeRequestData $recipeData): Recipe
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
