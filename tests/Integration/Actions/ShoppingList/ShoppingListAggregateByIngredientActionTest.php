<?php

namespace Tests\Integration\Actions\ShoppingList;

use App\Actions\PlannedMeal\PlannedMealStoreAction;
use App\Actions\Recipes\RecipeStoreAction;
use App\Actions\ShoppingList\ShoppingListAggregateByIngredientAction;
use App\Data\Requests\PlannedMeal\Entities\PlannedMealRequestData;
use App\Data\Requests\PlannedMeal\PlannedMealStoreRequestData;
use App\Data\Requests\Recipe\RecipeStoreRequestData;

test('groups ingredients by checked status', function () {
    /** @var \Tests\TestCase $this */
    $plannedMeals = app(PlannedMealStoreAction::class)->execute(
        $this->user,
        $this->defaultWorkspace,
        $this->userMultiplePlannedMealStoreRequestData
    );

    $shoppingList = $this->findShoppingListForWorkspaceAndDate($this->defaultWorkspace, $plannedMeals[0]->planned_date);
    $shoppingList->plannedMealIngredients()
        ->where('planned_meal_id', $plannedMeals[0]->id)
        ->update(['is_checked' => true]);

    $grouped = app(ShoppingListAggregateByIngredientAction::class)($shoppingList->fresh());

    $checkedIngredientsCount = $plannedMeals[0]->load('recipe.ingredients')->recipe->ingredients->count();
    $uncheckedIngredientsCount = $plannedMeals[1]->load('recipe.ingredients')->recipe->ingredients->count();

    expect($grouped['checked'])->toHaveCount($checkedIngredientsCount);
    expect($grouped['unchecked'])->toHaveCount($uncheckedIngredientsCount);

    foreach ($grouped['checked'] as $ingredient) {
        expect($ingredient['is_checked'])->toBeTrue();
        expect($ingredient)->toHaveKeys(['shopping_list_id', 'ingredient_id', 'name', 'total_quantity', 'unit', 'is_checked', 'from_planned_meals', 'from_recipes']);
        expect($ingredient['from_planned_meals'][0]['planned_meal_id'])->toBe($plannedMeals[0]->id);
    }

    foreach ($grouped['unchecked'] as $ingredient) {
        expect($ingredient['is_checked'])->toBeFalse();
        expect($ingredient)->toHaveKeys(['shopping_list_id', 'ingredient_id', 'name', 'total_quantity', 'unit', 'is_checked', 'from_planned_meals', 'from_recipes']);
        expect($ingredient['from_planned_meals'][0]['planned_meal_id'])->toBe($plannedMeals[1]->id);
    }
});

test('aggregates quantities by ingredient and unit', function () {
    /** @var \Tests\TestCase $this */
    $firstRecipe = app(RecipeStoreAction::class)->execute(
        $this->user,
        RecipeStoreRequestData::from([
            ...$this->recipeStoreRequestData->except('name', 'serving_size', 'ingredients')->transform(),
            'name' => 'Aggregate first recipe',
            'serving_size' => 1,
            'ingredients' => [
                ['name' => 'Shopping List Unit Tomatoes', 'quantity' => 2, 'unit' => 'pieces'],
                ['name' => 'Shopping List Unit Onions', 'quantity' => 1, 'unit' => 'pieces'],
            ],
        ])
    );
    $secondRecipe = app(RecipeStoreAction::class)->execute(
        $this->user,
        RecipeStoreRequestData::from([
            ...$this->recipeStoreRequestData->except('name', 'serving_size', 'ingredients')->transform(),
            'name' => 'Aggregate second recipe',
            'serving_size' => 1,
            'ingredients' => [
                ['name' => 'Shopping List Unit Tomatoes', 'quantity' => 3, 'unit' => 'pieces'],
                ['name' => 'Shopping List Unit Onions', 'quantity' => 2, 'unit' => 'kg'],
            ],
        ])
    );

    $plannedMeals = app(PlannedMealStoreAction::class)->execute(
        $this->user,
        $this->defaultWorkspace,
        PlannedMealStoreRequestData::from([
            'planned_meals' => [
                PlannedMealRequestData::from([
                    ...$this->userPlannedMealRequestData->except('recipe_id')->transform(),
                    'recipe_id' => $firstRecipe->id,
                ])->toArray(),
                PlannedMealRequestData::from([
                    ...$this->userPlannedMealRequestData->except('recipe_id')->transform(),
                    'recipe_id' => $secondRecipe->id,
                ])->toArray(),
            ],
        ])
    );

    $shoppingList = $this->findShoppingListForWorkspaceAndDate($this->defaultWorkspace, $plannedMeals[0]->planned_date);
    $grouped = app(ShoppingListAggregateByIngredientAction::class)($shoppingList);

    expect($grouped['checked'])->toBeEmpty();
    expect($grouped['unchecked'])->toHaveCount(3);

    $tomatoesEntry = collect($grouped['unchecked'])->first(
        fn ($item) => $item['name'] === 'Shopping List Unit Tomatoes' && $item['unit'] === 'pieces'
    );
    $onionsPiecesEntry = collect($grouped['unchecked'])->first(
        fn ($item) => $item['name'] === 'Shopping List Unit Onions' && $item['unit'] === 'pieces'
    );
    $onionsKgEntry = collect($grouped['unchecked'])->first(
        fn ($item) => $item['name'] === 'Shopping List Unit Onions' && $item['unit'] === 'kg'
    );

    expect($tomatoesEntry['total_quantity'])->toBe(5.0);
    expect($onionsPiecesEntry['total_quantity'])->toBe(1.0);
    expect($onionsKgEntry['total_quantity'])->toBe(2.0);

    $fromPlannedMeals = $tomatoesEntry['from_planned_meals'];
    $totalQuantity = array_sum(array_column($fromPlannedMeals, 'ingredient_quantity'));

    expect($totalQuantity)->toBe($tomatoesEntry['total_quantity']);
    expect($tomatoesEntry['unit'])->toBe('pieces');
    expect($tomatoesEntry['from_planned_meals'])->toHaveCount(2);
    expect($tomatoesEntry['from_recipes'])->toHaveCount(2);
    expect($fromPlannedMeals[0]['ingredient_quantity'])->toBeFloat();
    expect($fromPlannedMeals[1]['ingredient_quantity'])->toBeFloat();
});
