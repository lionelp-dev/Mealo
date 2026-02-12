<?php

use App\Models\PlannedMeal;
use App\Models\ShoppingList;
use App\Models\ShoppingListPlannedMealIngredient;
use App\Services\ShoppingListService;

beforeEach(function () {
    $this->shoppingList = ShoppingList::factory()->create();
    $this->plannedMeal = PlannedMeal::factory()->create();
    $this->shoppingListService = new ShoppingListService();
});

test('groups ingredients by checked status', function () {
    $ingredients = $this->plannedMeal->load('recipe')->recipe->load('ingredients')->ingredients->toArray();

    for ($i = 0; $i < 5;$i++) {
        ShoppingListPlannedMealIngredient::factory()->checked()->create(
            [
                'shopping_list_id' => $this->shoppingList->id,
                'planned_meal_id' => $this->plannedMeal->id,
                'ingredient_id' => $ingredients[$i]['id'],
            ]
        );
    }

    for ($i = 5; $i < 10;$i++) {
        ShoppingListPlannedMealIngredient::factory()->unchecked()->create(
            [
                'shopping_list_id' => $this->shoppingList->id,
                'planned_meal_id' => $this->plannedMeal->id,
                'ingredient_id' => $ingredients[$i]['id'],
            ]
        );
    }

    $grouped = $this->shoppingListService->getAggregatedIngredients($this->shoppingList->load('plannedMealIngredients'));

    // Should have 5 checked and 5 unchecked ingredients
    expect($grouped['checked'])->toHaveCount(5);
    expect($grouped['unchecked'])->toHaveCount(5);

    // Verify checked ingredients have is_checked = true
    foreach ($grouped['checked'] as $ingredient) {
        expect($ingredient['is_checked'])->toBeTrue();
        expect($ingredient)->toHaveKeys(['shopping_list_id', 'ingredient_id', 'name', 'total_quantity', 'unit', 'is_checked', 'from_planned_meals', 'from_recipes']);
    }

    // Verify unchecked ingredients have is_checked = false
    foreach ($grouped['unchecked'] as $ingredient) {
        expect($ingredient['is_checked'])->toBeFalse();
        expect($ingredient)->toHaveKeys(['shopping_list_id', 'ingredient_id', 'name', 'total_quantity', 'unit', 'is_checked', 'from_planned_meals', 'from_recipes']);
    }
});

test('grouped ingredients include from_planned_meals information', function () {
    $ingredients = $this->plannedMeal->load('recipe')->recipe->load('ingredients')->ingredients->toArray();

    ShoppingListPlannedMealIngredient::factory()->checked()->create([
        'shopping_list_id' => $this->shoppingList->id,
        'planned_meal_id' => $this->plannedMeal->id,
        'ingredient_id' => $ingredients[0]['id'],
    ]);

    $grouped = $this->shoppingListService->getAggregatedIngredients($this->shoppingList->load('plannedMealIngredients'));
    $checkedIngredient = $grouped['checked'][0];

    // Verify from_planned_meals structure
    expect($checkedIngredient['from_planned_meals'])->toBeArray();
    expect($checkedIngredient['from_planned_meals'][0])->toHaveKeys([
        'planned_meal_id',
        'recipe_id',
        'recipe_name',
        'ingredient_quantity',
        'ingredient_unit',
        'is_checked',
    ]);
    expect($checkedIngredient['from_planned_meals'][0]['planned_meal_id'])->toBe($this->plannedMeal->id);
    expect($checkedIngredient['from_planned_meals'][0]['recipe_id'])->toBe($this->plannedMeal->recipe_id);
});

test('grouped ingredients include from_recipes information', function () {
    $ingredients = $this->plannedMeal->load('recipe')->recipe->load('ingredients')->ingredients->toArray();

    ShoppingListPlannedMealIngredient::factory()->unchecked()->create([
        'shopping_list_id' => $this->shoppingList->id,
        'planned_meal_id' => $this->plannedMeal->id,
        'ingredient_id' => $ingredients[0]['id'],
    ]);

    $grouped = $this->shoppingListService->getAggregatedIngredients($this->shoppingList->load('plannedMealIngredients'));
    $uncheckedIngredient = $grouped['unchecked'][0];

    // Verify from_recipes structure
    expect($uncheckedIngredient['from_recipes'])->toBeArray();
    expect($uncheckedIngredient['from_recipes'][0])->toHaveKeys([
        'recipe_id',
        'recipe_name',
        'ingredient_quantity',
        'ingredient_unit',
    ]);
    expect($uncheckedIngredient['from_recipes'][0]['recipe_id'])->toBe($this->plannedMeal->recipe_id);
});

test('aggregates quantities for same ingredient from multiple planned meals', function () {
    $user = \App\Models\User::factory()->create();
    $ingredient = \App\Models\Ingredient::factory()->create(['user_id' => $user->id]);

    // Create recipe1 with the ingredient (2 kg) and serving_size=1
    $recipe1 = \App\Models\Recipe::factory()->create(['user_id' => $user->id, 'serving_size' => 1]);
    $recipe1->ingredients()->attach($ingredient->id, ['quantity' => '2', 'unit' => 'kg']);

    // Create recipe2 with the same ingredient (3 kg) and serving_size=1
    $recipe2 = \App\Models\Recipe::factory()->create(['user_id' => $user->id, 'serving_size' => 1]);
    $recipe2->ingredients()->attach($ingredient->id, ['quantity' => '3', 'unit' => 'kg']);

    // Create planned meals for both recipes
    $plannedMeal1 = PlannedMeal::factory()->create(['recipe_id' => $recipe1->id]);
    $plannedMeal2 = PlannedMeal::factory()->create(['recipe_id' => $recipe2->id]);

    // Create shopping list ingredients for both planned meals (no quantity/unit stored here)
    ShoppingListPlannedMealIngredient::factory()->create([
        'shopping_list_id' => $this->shoppingList->id,
        'planned_meal_id' => $plannedMeal1->id,
        'ingredient_id' => $ingredient->id,
        'is_checked' => false,
    ]);

    ShoppingListPlannedMealIngredient::factory()->create([
        'shopping_list_id' => $this->shoppingList->id,
        'planned_meal_id' => $plannedMeal2->id,
        'ingredient_id' => $ingredient->id,
        'is_checked' => false,
    ]);

    $grouped = $this->shoppingListService->getAggregatedIngredients($this->shoppingList->load('plannedMealIngredients'));

    // Should have one aggregated ingredient with total quantity of 5 kg
    expect($grouped['unchecked'])->toHaveCount(1);

    // Verify the quantity is the sum of both recipes (2 + 3 = 5)
    $totalQuantity = $grouped['unchecked'][0]['total_quantity'];
    expect($totalQuantity)->toBeFloat();

    // Verify individual recipe quantities sum correctly
    $fromPlannedMeals = $grouped['unchecked'][0]['from_planned_meals'];
    $sum = array_sum(array_column($fromPlannedMeals, 'ingredient_quantity'));
    expect($sum)->toBe($totalQuantity);

    expect($grouped['unchecked'][0]['unit'])->toBe('kg');
    expect($grouped['unchecked'][0]['from_planned_meals'])->toHaveCount(2);
    expect($grouped['unchecked'][0]['from_recipes'])->toHaveCount(2);

    // Verify the quantities from each planned meal
    expect($fromPlannedMeals[0]['ingredient_quantity'])->toBeFloat();
    expect($fromPlannedMeals[1]['ingredient_quantity'])->toBeFloat();
});
