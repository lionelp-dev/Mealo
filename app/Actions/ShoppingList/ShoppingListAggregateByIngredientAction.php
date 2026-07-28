<?php

namespace App\Actions\ShoppingList;

use App\Models\RecipeIngredient;
use App\Models\ShoppingList;

class ShoppingListAggregateByIngredientAction
{
    /**
     * @return array{checked: array<int, array<string, mixed>>, unchecked: array<int, array<string, mixed>>}
     */
    public function __invoke(ShoppingList $shoppingList): array
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
                    ->firstOrFail();

                $ingredientQuantity = round(($pivotData->quantity / $recipe->serving_size) * $plannedMeal->serving_size, 2);
                $key = $ingredient->id.':'.$pivotData->unit;
                $statusKey = $plannedMealIngredient->is_checked ? 'checked' : 'unchecked';

                if (! isset($acc[$statusKey][$key])) {
                    $acc[$statusKey][$key] = [
                        'shopping_list_id' => $shoppingList->id,
                        'ingredient_id' => $ingredient->id,
                        'name' => $ingredient->name,
                        'total_quantity' => 0,
                        'unit' => $pivotData->unit,
                        'is_checked' => $plannedMealIngredient->is_checked,
                    ];
                }

                $acc[$statusKey][$key]['total_quantity'] = round($acc[$statusKey][$key]['total_quantity'] + $ingredientQuantity, 2);

                $acc[$statusKey][$key]['from_planned_meals'][] = [
                    'planned_meal_id' => $plannedMeal->id,
                    'recipe_id' => $recipe->id,
                    'recipe_name' => $recipe->name,
                    'ingredient_quantity' => $ingredientQuantity,
                    'ingredient_unit' => $pivotData->unit,
                    'is_checked' => $plannedMealIngredient->is_checked,
                ];

                if (! isset($acc[$statusKey][$key]['from_recipes'][$recipe->id])) {
                    $acc[$statusKey][$key]['from_recipes'][$recipe->id] = [
                        'recipe_id' => $recipe->id,
                        'recipe_name' => $recipe->name,
                        'ingredient_quantity' => 0,
                        'ingredient_unit' => $pivotData->unit,
                    ];
                }

                $acc[$statusKey][$key]['from_recipes'][$recipe->id]['ingredient_quantity'] = round($acc[$statusKey][$key]['from_recipes'][$recipe->id]['ingredient_quantity'] + $ingredientQuantity, 2);

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
}
