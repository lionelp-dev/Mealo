<?php

namespace App\Observers;

use App\Models\Recipe;

class RecipeObserver
{
    /**
     * Handle the Recipe "deleting" event.
     * Delete all planned meals associated with this recipe.
     * This will trigger the PlannedMealObserver which will sync shopping lists.
     */
    public function deleting(Recipe $recipe): void
    {
        // Delete all planned meals for this recipe
        // This will trigger PlannedMealObserver::deleted() for each planned meal
        // which will sync the shopping lists
        $recipe->plannedMeals()->each(function ($plannedMeal) {
            $plannedMeal->delete();
        });
    }
}
