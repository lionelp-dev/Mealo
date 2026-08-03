<?php

namespace App\Actions\ShoppingList;

use App\Models\RecipeIngredient;
use App\Models\ShoppingList;
use RuntimeException;

class ShoppingListGroupByRecipeAction
{
    /**
     * @return array<int, array<string, mixed>>
     */
    public function __invoke(ShoppingList $shoppingList): array
    {
        /** @var array<string, array{recipe_id: string, recipe_name: string, ingredients: array{checked: array<string, array<string, mixed>>, unchecked: array<string, array<string, mixed>>}}> $grouped */
        $grouped = [];

        $plannedMealIngredients = $shoppingList->plannedMealIngredients()
            ->with([
                'plannedMeal.recipe',
                'ingredient',
            ])
            ->get();

        foreach ($plannedMealIngredients as $plannedMealIngredient) {
            $plannedMeal = $plannedMealIngredient->plannedMeal;
            if ($plannedMeal === null) {
                throw new RuntimeException('Shopping list ingredient is missing its planned meal.');
            }

            $recipe = $plannedMeal->recipe;
            if ($recipe === null) {
                throw new RuntimeException('Planned meal is missing its recipe.');
            }

            $ingredient = $plannedMealIngredient->ingredient;
            if ($ingredient === null) {
                throw new RuntimeException('Shopping list ingredient is missing its ingredient.');
            }

            $pivotData = RecipeIngredient::query()
                ->where('recipe_id', $recipe->id)
                ->where('ingredient_id', $ingredient->id)
                ->firstOrFail();

            if ($recipe->serving_size <= 0) {
                throw new RuntimeException('Recipe serving size must be greater than zero.');
            }

            $ingredientQuantity = round(($pivotData->quantity / $recipe->serving_size) * $plannedMeal->serving_size, 2);
            $shoppingListRecipeKey = $shoppingList->id.':'.$recipe->id;
            $ingredientKey = $ingredient->id;
            $statusKey = $plannedMealIngredient->is_checked ? 'checked' : 'unchecked';

            if (! isset($grouped[$shoppingListRecipeKey])) {
                $grouped[$shoppingListRecipeKey] = [
                    'recipe_id' => $recipe->id,
                    'recipe_name' => $recipe->name,
                    'ingredients' => [
                        'checked' => [],
                        'unchecked' => [],
                    ],
                ];
            }

            if (isset($grouped[$shoppingListRecipeKey]['ingredients'][$statusKey][$ingredientKey])) {
                $currentIngredient = $grouped[$shoppingListRecipeKey]['ingredients'][$statusKey][$ingredientKey];
                $currentQuantity = is_numeric($currentIngredient['total_quantity'])
                    ? (float) $currentIngredient['total_quantity']
                    : 0.0;
                $currentIngredient['total_quantity'] = round($currentQuantity + $ingredientQuantity, 2);
                $currentIngredient['is_checked'] = (bool) $currentIngredient['is_checked'] && $plannedMealIngredient->is_checked;

                /** @var array<int, array<string, mixed>> $fromPlannedMeals */
                $fromPlannedMeals = $currentIngredient['from_planned_meals'];
                $fromPlannedMeals[] = [
                    'planned_meal_id' => $plannedMeal->id,
                    'quantity' => $ingredientQuantity,
                    'is_checked' => $plannedMealIngredient->is_checked,
                ];
                $currentIngredient['from_planned_meals'] = $fromPlannedMeals;
                $grouped[$shoppingListRecipeKey]['ingredients'][$statusKey][$ingredientKey] = $currentIngredient;

                continue;
            }

            $grouped[$shoppingListRecipeKey]['ingredients'][$statusKey][$ingredientKey] = [
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
        }

        $recipes = [];
        foreach ($grouped as $recipe) {
            $recipes[] = [
                'recipe_id' => $recipe['recipe_id'],
                'recipe_name' => $recipe['recipe_name'],
                'ingredients' => [
                    'checked' => array_values($recipe['ingredients']['checked']),
                    'unchecked' => array_values($recipe['ingredients']['unchecked']),
                ],
            ];
        }

        return $recipes;
    }
}
