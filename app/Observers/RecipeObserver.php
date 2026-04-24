<?php

namespace App\Observers;

use App\Actions\Recipes\RecipeImageDeleteAction;
use App\Models\Recipe;

class RecipeObserver
{
    public function __construct(
        private RecipeImageDeleteAction $recipeImageDeleteAction
    ) {}

    /**
     * Handle the Recipe "deleting" event.
     * Delete all planned meals associated with this recipe.
     * This will trigger the PlannedMealObserver which will sync shopping lists.
     */
    public function deleting(Recipe $recipe): void
    {
        // Delete recipe image if exists
        ($this->recipeImageDeleteAction)($recipe);

        // Delete all planned meals for this recipe
        // This will trigger PlannedMealObserver::deleted() for each planned meal
        // which will sync the shopping lists
        $recipe->plannedMeals()->each(function ($plannedMeal) {
            $plannedMeal->delete();
        });
    }
}
