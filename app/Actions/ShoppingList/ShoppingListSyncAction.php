<?php

namespace App\Actions\ShoppingList;

use App\Models\PlannedMeal;
use App\Models\ShoppingList;
use Carbon\Carbon;

class ShoppingListSyncAction
{
    /**
     * Synchronize the shopping list for a planned meal's week.
     */
    public function __invoke(PlannedMeal $plannedMeal): void
    {
        $weekStart = Carbon::parse($plannedMeal->planned_date)->startOfWeek();
        $weekEnd = $weekStart->clone()->endOfWeek();

        $workspace = $plannedMeal->workspace()->firstOrFail();

        $shoppingList = ShoppingList::query()->firstOrCreate([
            'workspace_id' => $workspace->id,
            'week_start' => $weekStart,
        ], [
            'user_id' => $plannedMeal->user_id,
        ]);

        $existingCheckedStatuses = $shoppingList->plannedMealIngredients()
            ->get()
            ->mapWithKeys(function ($item) {
                $key = $item->planned_meal_id.':'.$item->ingredient_id.':'.$item->unit;

                return [$key => $item->is_checked];
            });

        $plannedMeals = PlannedMeal::query()
            ->where('planned_meals.workspace_id', $workspace->id)
            ->whereDate('planned_meals.planned_date', '>=', $weekStart->toDateString())
            ->whereDate('planned_meals.planned_date', '<=', $weekEnd->toDateString())
            ->with(['recipe.ingredients'])
            ->get();

        $plannedMealIngredients = collect($plannedMeals)->flatMap(function ($plannedMeal) use ($shoppingList, $existingCheckedStatuses) {
            return collect($plannedMeal->recipe->ingredients)->map(function ($ingredient) use ($shoppingList, $plannedMeal, $existingCheckedStatuses) {
                $unit = $ingredient->pivot->unit;
                $key = $plannedMeal->id.':'.$ingredient->id.':'.$unit;

                return [
                    'shopping_list_id' => $shoppingList->id,
                    'planned_meal_id' => $plannedMeal->id,
                    'ingredient_id' => $ingredient->id,
                    'unit' => $unit,
                    'is_checked' => $existingCheckedStatuses->get($key, false),
                ];
            });
        });

        $shoppingList->plannedMealIngredients()->delete();
        $shoppingList->plannedMealIngredients()->createMany($plannedMealIngredients);
    }
}
