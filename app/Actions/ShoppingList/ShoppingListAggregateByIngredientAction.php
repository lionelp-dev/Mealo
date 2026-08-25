<?php

namespace App\Actions\ShoppingList;

use App\Models\RecipeIngredient;
use App\Models\ShoppingList;
use RuntimeException;

class ShoppingListAggregateByIngredientAction
{
    /**
     * @return array{checked: array<int, array<string, mixed>>, unchecked: array<int, array<string, mixed>>}
     */
    public function __invoke(ShoppingList $shoppingList): array
    {
        /** @var array{checked: array<string, array<string, mixed>>, unchecked: array<string, array<string, mixed>>} $result */
        $result = ['checked' => [], 'unchecked' => []];

        $plannedMealIngredients = $shoppingList->plannedMealIngredients()
            ->with([
                'plannedMeal.recipe',
                'ingredient.category',
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

            $category = $ingredient->category;
            if ($category === null) {
                throw new RuntimeException('Shopping list ingredient is missing its category.');
            }

            $pivotData = RecipeIngredient::query()
                ->where('recipe_id', $recipe->id)
                ->where('ingredient_id', $ingredient->id)
                ->firstOrFail();

            if ($recipe->serving_size <= 0) {
                throw new RuntimeException('Recipe serving size must be greater than zero.');
            }

            $ingredientQuantity = round(($pivotData->quantity / $recipe->serving_size) * $plannedMeal->serving_size, 2);
            $key = $ingredient->id.':'.$pivotData->unit;
            $statusKey = $plannedMealIngredient->is_checked ? 'checked' : 'unchecked';

            if (! isset($result[$statusKey][$key])) {
                $result[$statusKey][$key] = [
                    'shopping_list_id' => $shoppingList->id,
                    'ingredient_id' => $ingredient->id,
                    'name' => $ingredient->name,
                    'category_id' => $ingredient->category_id,
                    'category_name' => $category->name,
                    'category_slug' => $category->slug,
                    'total_quantity' => 0.0,
                    'unit' => $pivotData->unit,
                    'is_checked' => $plannedMealIngredient->is_checked,
                    'from_planned_meals' => [],
                    'from_recipes' => [],
                ];
            }

            $totalQuantity = is_numeric($result[$statusKey][$key]['total_quantity'])
                ? (float) $result[$statusKey][$key]['total_quantity']
                : 0.0;
            $result[$statusKey][$key]['total_quantity'] = round($totalQuantity + $ingredientQuantity, 2);

            /** @var array<int, array<string, mixed>> $fromPlannedMeals */
            $fromPlannedMeals = $result[$statusKey][$key]['from_planned_meals'];
            $fromPlannedMeals[] = [
                'planned_meal_id' => $plannedMeal->id,
                'recipe_id' => $recipe->id,
                'recipe_name' => $recipe->name,
                'ingredient_quantity' => $ingredientQuantity,
                'ingredient_unit' => $pivotData->unit,
                'is_checked' => $plannedMealIngredient->is_checked,
            ];
            $result[$statusKey][$key]['from_planned_meals'] = $fromPlannedMeals;

            /** @var array<string, array<string, mixed>> $fromRecipes */
            $fromRecipes = $result[$statusKey][$key]['from_recipes'];

            if (! isset($fromRecipes[$recipe->id])) {
                $fromRecipes[$recipe->id] = [
                    'recipe_id' => $recipe->id,
                    'recipe_name' => $recipe->name,
                    'ingredient_quantity' => 0.0,
                    'ingredient_unit' => $pivotData->unit,
                ];
            }

            $recipeQuantity = is_numeric($fromRecipes[$recipe->id]['ingredient_quantity'])
                ? (float) $fromRecipes[$recipe->id]['ingredient_quantity']
                : 0.0;
            $fromRecipes[$recipe->id]['ingredient_quantity'] = round($recipeQuantity + $ingredientQuantity, 2);
            $result[$statusKey][$key]['from_recipes'] = $fromRecipes;
        }

        $checked = [];
        foreach ($result['checked'] as $ingredient) {
            /** @var array<string, array<string, mixed>> $fromRecipes */
            $fromRecipes = $ingredient['from_recipes'];
            $ingredient['from_recipes'] = array_values($fromRecipes);
            $checked[] = $ingredient;
        }

        $unchecked = [];
        foreach ($result['unchecked'] as $ingredient) {
            /** @var array<string, array<string, mixed>> $fromRecipes */
            $fromRecipes = $ingredient['from_recipes'];
            $ingredient['from_recipes'] = array_values($fromRecipes);
            $unchecked[] = $ingredient;
        }

        return [
            'checked' => $checked,
            'unchecked' => $unchecked,
        ];
    }
}
