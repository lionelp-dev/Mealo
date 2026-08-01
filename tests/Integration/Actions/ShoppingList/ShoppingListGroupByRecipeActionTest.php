<?php

namespace Tests\Integration\Actions\ShoppingList;

use App\Actions\PlannedMeal\PlannedMealStoreAction;
use App\Actions\ShoppingList\ShoppingListGroupByRecipeAction;

beforeEach(function () {
    /** @var \Tests\TestCase $this */
    $this->setUpUserMultiplePlannedMealStoreRequestDataContext();
});

test('groups ingredients by recipe and checked status', function () {
    /** @var \Tests\TestCase $this */
    $plannedMeals = app(PlannedMealStoreAction::class)->execute(
        $this->user,
        $this->user->defaultWorkspace(),
        $this->userMultiplePlannedMealStoreRequestData
    );

    $shoppingList = $this->findShoppingListForWorkspaceAndDate($this->user->defaultWorkspace(), $plannedMeals[0]->planned_date);
    $checkedIngredient = $shoppingList->plannedMealIngredients()
        ->where('planned_meal_id', $plannedMeals[0]->id)
        ->firstOrFail();
    $checkedIngredient->update(['is_checked' => true]);

    $grouped = app(ShoppingListGroupByRecipeAction::class)($shoppingList->fresh());

    expect($grouped)->toHaveCount(2);

    $checkedRecipe = collect($grouped)->first(fn ($recipe) => $recipe['recipe_id'] === $plannedMeals[0]->recipe_id);
    $uncheckedRecipe = collect($grouped)->first(fn ($recipe) => $recipe['recipe_id'] === $plannedMeals[1]->recipe_id);

    expect($checkedRecipe['recipe_name'])->toBe($plannedMeals[0]->recipe->name);
    expect($checkedRecipe['ingredients']['checked'])->toHaveCount(1);
    expect($checkedRecipe['ingredients']['checked'][0])->toHaveKeys(['shopping_list_id', 'ingredient_id', 'name', 'total_quantity', 'unit', 'is_checked', 'from_planned_meals']);
    expect($checkedRecipe['ingredients']['checked'][0]['is_checked'])->toBeTrue();

    expect($uncheckedRecipe['recipe_name'])->toBe($plannedMeals[1]->recipe->name);
    expect($uncheckedRecipe['ingredients']['unchecked'])->not->toBeEmpty();
});
