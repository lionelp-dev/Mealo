<?php

namespace App\Services;

use App\Models\PlannedMeal;
use App\Models\RecipeIngredient;
use App\Models\ShoppingList;
use Carbon\Carbon;

class ShoppingListService
{
    /**
     * Synchronize shopping list for a planned meal's week.
     * Preserves the is_checked status for existing ingredients.
     */
    public function sync(PlannedMeal $plannedMeal): void
    {
        $weekStart = Carbon::parse($plannedMeal->planned_date)->startOfWeek();
        $weekEnd = $weekStart->clone()->endOfWeek();

        $workspace = $plannedMeal->workspace()->first();

        $shoppingList = ShoppingList::query()->firstOrCreate([
            'user_id' => $plannedMeal->user_id,
            'workspace_id' => $workspace->id,
            'week_start' => $weekStart,
        ]);

        // Save existing checked statuses before deletion
        $existingCheckedStatuses = $shoppingList->plannedMealIngredients()
            ->get()
            ->mapWithKeys(function ($item) {
                // Key: planned_meal_id:ingredient_id:unit
                $key = $item->planned_meal_id . ':' . $item->ingredient_id . ':' . $item->unit;
                return [$key => $item->is_checked];
            });

        $plannedMeals = PlannedMeal::query()
            ->where('planned_meals.workspace_id', $workspace->id)
            ->whereBetween('planned_meals.planned_date', [
                $weekStart->toDateString(),
                $weekEnd->toDateString(),
            ])
            ->with(['recipe.ingredients'])
            ->get();

        $aggregatedPlannedMealIngredients = collect($plannedMeals)->flatMap(function ($plannedMeal) use ($shoppingList, $existingCheckedStatuses) {
            $ingredients = $plannedMeal->recipe->ingredients;
            return collect($ingredients)->map(function ($ingredient) use ($shoppingList, $plannedMeal, $existingCheckedStatuses) {
                // Get unit from recipe_ingredients pivot
                $unit = $ingredient->pivot->unit;

                // Restore checked status if it existed
                $key = $plannedMeal->id . ':' . $ingredient->id . ':' . $unit;
                $isChecked = $existingCheckedStatuses->get($key, false);

                return [
                    'shopping_list_id' => $shoppingList->id,
                    'planned_meal_id' => $plannedMeal->id,
                    'ingredient_id' => $ingredient->id,
                    'unit' => $unit,
                    'is_checked' => $isChecked,
                ];
            });
        });

        $shoppingList->plannedMealIngredients()->delete();

        $shoppingList->plannedMealIngredients()->createMany($aggregatedPlannedMealIngredients);
    }

    /**
     * Get aggregated ingredients grouped by checked status.
     *
     * @return array<string,array>
     */
    public function getAggregatedIngredients(ShoppingList $shoppingList): array
    {
        $result = $shoppingList->plannedMealIngredients()
            ->with([
                'plannedMeal.recipe',
                'ingredient',
            ])
            ->get()
            ->reduce(function ($acc, $plannedMealIngredient) use ($shoppingList) {
                $plannedMeal = $plannedMealIngredient->plannedMeal;
                $recipe = $plannedMeal->recipe;
                $ingredient = $plannedMealIngredient->ingredient;
                $pivotData = RecipeIngredient::query()
                    ->where('recipe_id', $recipe->id)
                    ->where('ingredient_id', $ingredient->id)
                    ->first();
                $ingredient_quantity = round(($pivotData->quantity / $recipe->serving_size) * $plannedMeal->serving_size, 2);

                $key = $ingredient->id . ':' . $pivotData->unit;

                $statusKey = $plannedMealIngredient->is_checked ? 'checked' : 'unchecked';

                if (!isset($acc[$statusKey][$key])) {
                    $acc[$statusKey][$key] = [
                        'shopping_list_id' => $shoppingList->id,
                        'ingredient_id' => $ingredient->id,
                        'name' => $ingredient->name,
                        'total_quantity' => 0,
                        'unit' => $pivotData->unit,
                        'is_checked' => $plannedMealIngredient->is_checked,
                    ];
                }

                $acc[$statusKey][$key]['total_quantity'] = round($acc[$statusKey][$key]['total_quantity'] + $ingredient_quantity, 2);

                $acc[$statusKey][$key]['from_planned_meals'][]
                    = [
                        'planned_meal_id' => $plannedMeal->id,
                        'recipe_id' => $recipe->id,
                        'recipe_name' => $recipe->name,
                        'ingredient_quantity' => $ingredient_quantity,
                        'ingredient_unit' => $pivotData->unit,
                        'is_checked' => $plannedMealIngredient->is_checked,
                    ];

                if (!isset($acc[$statusKey][$key]['from_recipes'][$recipe->id])) {
                    $acc[$statusKey][$key]['from_recipes'][$recipe->id] = [
                        'recipe_id' => $recipe->id,
                        'recipe_name' => $recipe->name,
                        'ingredient_quantity' => 0,
                        'ingredient_unit' => $pivotData->unit,
                    ];
                }

                $acc[$statusKey][$key]['from_recipes'][$recipe->id]['ingredient_quantity'] = round($acc[$statusKey][$key]['from_recipes'][$recipe->id]['ingredient_quantity'] + $ingredient_quantity, 2);

                return $acc;
            }, []);

        return [
            'checked' => array_values(array_map(function ($ingredient) {
                $ingredient['from_recipes'] = array_values($ingredient['from_recipes']);

                return $ingredient;
            }, $result['checked'] ?? [])),
            'unchecked' => array_values(array_map(function ($ingredient) {
                $ingredient['from_recipes'] = array_values($ingredient['from_recipes']);

                return $ingredient;
            }, $result['unchecked'] ?? [])),
        ];
    }

    /**
     * Get ingredients grouped by recipe.
     *
     * @return array<int, array{recipe_id: int, recipe_name: string, ingredients: array<int, array{id: int, name: string, quantity: float, unit: string, is_checked: bool}>}>
     */
    public function getIngredientsGroupedByRecipe(ShoppingList $shoppingList): array
    {
        $grouped = $shoppingList->plannedMealIngredients()
            ->with([
                'plannedMeal.recipe',
                'ingredient',
            ])
            ->get()
            ->reduce(function ($acc, $plannedMealIngredient) use ($shoppingList) {
                $plannedMeal = $plannedMealIngredient->plannedMeal;
                $recipe = $plannedMeal->recipe;
                $ingredient = $plannedMealIngredient->ingredient;

                $pivotData = RecipeIngredient::query()
                    ->where('recipe_id', $recipe->id)
                    ->where('ingredient_id', $ingredient->id)
                    ->first();

                $ingredient_quantity = round(($pivotData->quantity / $recipe->serving_size) * $plannedMeal->serving_size, 2);

                $shoppingListRecipeKey = $shoppingList->id . ':' . $recipe->id;

                $plannedMealIngredientKey = $plannedMeal->id . ':' . $ingredient->id . ':' . $pivotData->unit;

                $ingredientKey = $ingredient->id;

                $statusKey = $plannedMealIngredient->is_checked ? 'checked' : 'unchecked';

                if (!isset($acc[$shoppingListRecipeKey])) {
                    $acc[$shoppingListRecipeKey] = [
                        'recipe_id' => $recipe->id,
                        'recipe_name' => $recipe->name,
                        'ingredients' => [],
                    ];
                }

                if (isset($acc[$shoppingListRecipeKey]['ingredients'][$statusKey][$ingredientKey])) {
                    $acc[$shoppingListRecipeKey]['ingredients'][$statusKey][$ingredientKey]['total_quantity'] = round($acc[$shoppingListRecipeKey]['ingredients'][$statusKey][$ingredientKey]['total_quantity'] + $ingredient_quantity, 2);
                    $acc[$shoppingListRecipeKey]['ingredients'][$statusKey][$ingredientKey]['is_checked']
                        = $acc[$shoppingListRecipeKey]['ingredients'][$statusKey][$ingredientKey]['is_checked'] && $plannedMealIngredient->is_checked;
                    $acc[$shoppingListRecipeKey]['ingredients'][$statusKey][$ingredientKey]['from_planned_meals'][] = [
                        'planned_meal_id' => $plannedMeal->id,
                        'quantity' => $ingredient_quantity,
                        'is_checked' => $plannedMealIngredient->is_checked,
                    ];
                } else {
                    $acc[$shoppingListRecipeKey]['ingredients'][$statusKey][$ingredientKey] = [
                        'shopping_list_id' => $shoppingList->id,
                        'ingredient_id' => $ingredient->id,
                        'name' => $ingredient->name,
                        'total_quantity' => $ingredient_quantity,
                        'unit' => $pivotData->unit,
                        'is_checked' => $plannedMealIngredient->is_checked,
                        'from_planned_meals' => [[
                            'planned_meal_id' => $plannedMeal->id,
                            'quantity' => $ingredient_quantity,
                            'is_checked' => $plannedMealIngredient->is_checked,
                        ]],
                    ];
                }

                return $acc;
            }, []);

        return array_values(array_map(function ($recipe) {
            return [
                'recipe_id' => $recipe['recipe_id'],
                'recipe_name' => $recipe['recipe_name'],
                'ingredients' => [
                    'checked' => array_values($recipe['ingredients']['checked'] ?? []),
                    'unchecked' => array_values($recipe['ingredients']['unchecked'] ?? []),
                ],
            ];
        }, $grouped));
    }
}
