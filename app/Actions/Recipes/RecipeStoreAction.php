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
     *
     * @param  string|null  $imageDataUrl  Trusted base64 data URL (e.g. AI-generated image
     *                                     from the internal service). Never sourced from a
     *                                     user request DTO — user uploads use $recipeData->image.
     */
    public function execute(User $user, RecipeStoreRequestData $recipeData, ?string $imageDataUrl = null): Recipe
    {
        return DB::transaction(function () use ($user, $recipeData, $imageDataUrl): Recipe {
            $recipe = Recipe::query()->create([
                'user_id' => $user->id,
                ...$recipeData
                    ->except('meal_times', 'ingredients', 'steps', 'tags', 'image')
                    ->transform(),
            ]);

            ($this->syncIngredients)($recipe, $recipeData->ingredients);

            ($this->syncTags)($recipe, $recipeData->tags);

            ($this->syncMealTimes)($recipe, $recipeData->meal_times);

            ($this->syncSteps)($recipe, $recipeData->steps);

            if ($recipeData->image) {
                ($this->uploadImage)($recipe, $recipeData->image);
                $recipe->refresh();
            } elseif ($imageDataUrl !== null) {
                ($this->uploadImage)->fromDataUrl($recipe, $imageDataUrl);
                $recipe->refresh();
            }

            return $recipe;
        });
    }
}
