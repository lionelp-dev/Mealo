<?php

namespace App\Actions\ShoppingList;

use App\Models\RecipeIngredient;
use App\Models\ShoppingList;

class ShoppingListGroupByRecipeAction
{
    /**
     * @return array<int, array<string, mixed>>
     */
    public function __invoke(ShoppingList $shoppingList): array
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
                    ->firstOrFail();

                $ingredientQuantity = round(($pivotData->quantity / $recipe->serving_size) * $plannedMeal->serving_size, 2);
                $shoppingListRecipeKey = $shoppingList->id.':'.$recipe->id;
                $ingredientKey = $ingredient->id;
                $statusKey = $plannedMealIngredient->is_checked ? 'checked' : 'unchecked';

                if (! isset($acc[$shoppingListRecipeKey])) {
                    $acc[$shoppingListRecipeKey] = [
                        'recipe_id' => $recipe->id,
                        'recipe_name' => $recipe->name,
                        'ingredients' => [],
                    ];
                }

                if (isset($acc[$shoppingListRecipeKey]['ingredients'][$statusKey][$ingredientKey])) {
                    $acc[$shoppingListRecipeKey]['ingredients'][$statusKey][$ingredientKey]['total_quantity'] = round($acc[$shoppingListRecipeKey]['ingredients'][$statusKey][$ingredientKey]['total_quantity'] + $ingredientQuantity, 2);
                    $acc[$shoppingListRecipeKey]['ingredients'][$statusKey][$ingredientKey]['is_checked']
                        = $acc[$shoppingListRecipeKey]['ingredients'][$statusKey][$ingredientKey]['is_checked'] && $plannedMealIngredient->is_checked;
                    $acc[$shoppingListRecipeKey]['ingredients'][$statusKey][$ingredientKey]['from_planned_meals'][] = [
                        'planned_meal_id' => $plannedMeal->id,
                        'quantity' => $ingredientQuantity,
                        'is_checked' => $plannedMealIngredient->is_checked,
                    ];

                    return $acc;
                }

                $acc[$shoppingListRecipeKey]['ingredients'][$statusKey][$ingredientKey] = [
                    'shopping_list_id' => $shoppingList->id,
                    'ingredient_id' => $ingredient->id,
                    'name' => $ingredient->name,
                    'total_quantity' => $ingredientQuantity,
                    'unit' => $pivotData->unit,
                    'is_checked' => $plannedMealIngredient->is_checked,
                    'from_planned_meals' => [[
                        'planned_meal_id' => $plannedMeal->id,
                        'quantity' => $ingredientQuantity,
                        'is_checked' => $plannedMealIngredient->is_checked,
                    ]],
                ];

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
