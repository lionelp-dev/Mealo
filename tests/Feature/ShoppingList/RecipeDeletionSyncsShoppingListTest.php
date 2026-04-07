<?php

use App\Models\Ingredient;
use App\Models\MealTime;
use App\Models\PlannedMeal;
use App\Models\Recipe;
use App\Models\ShoppingList;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('synchronizes shopping list when a recipe with planned meals is deleted', function () {
    // Create a user
    $user = User::factory()->create();
    $workspace = $user->defaultWorkspace();

    // Create a recipe with ingredients
    $recipe = Recipe::factory()
        ->for($user)
        ->create();

    $ingredient1 = Ingredient::factory()->for($user)->create(['name' => 'Tomato']);
    $ingredient2 = Ingredient::factory()->for($user)->create(['name' => 'Onion']);

    $recipe->ingredients()->attach($ingredient1->id, ['quantity' => 2, 'unit' => 'pieces']);
    $recipe->ingredients()->attach($ingredient2->id, ['quantity' => 1, 'unit' => 'pieces']);

    // Create a planned meal for next Monday
    $plannedDate = now()->startOfWeek()->addWeek();
    $mealTime = MealTime::query()->first();

    $plannedMeal = PlannedMeal::factory()->create([
        'user_id' => $user->id,
        'workspace_id' => $workspace->id,
        'recipe_id' => $recipe->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => $plannedDate,
    ]);

    // Verify shopping list was created with ingredients
    $shoppingList = ShoppingList::query()
        ->where('user_id', $user->id)
        ->where('workspace_id', $workspace->id)
        ->where('week_start', $plannedDate->startOfWeek())
        ->first();

    expect($shoppingList)->not->toBeNull();
    expect($shoppingList->plannedMealIngredients)->toHaveCount(2);

    $ingredientNames = $shoppingList->plannedMealIngredients->pluck('ingredient.name')->toArray();
    expect($ingredientNames)->toContain('Tomato', 'Onion');

    // Delete the recipe
    $recipe->delete();

    // Verify planned meal was deleted
    expect(PlannedMeal::query()->find($plannedMeal->id))->toBeNull();

    // Refresh shopping list to get updated data
    $shoppingList->refresh();

    // Verify shopping list was synchronized (ingredients removed)
    expect($shoppingList->plannedMealIngredients)->toHaveCount(0);
});

it('synchronizes shopping list for multiple weeks when recipe with multiple planned meals is deleted', function () {
    // Create a user
    $user = User::factory()->create();
    $workspace = $user->defaultWorkspace();

    // Create a recipe with ingredients
    $recipe = Recipe::factory()
        ->for($user)
        ->create();

    $ingredient = Ingredient::factory()->for($user)->create(['name' => 'Pasta']);
    $recipe->ingredients()->attach($ingredient->id, ['quantity' => 200, 'unit' => 'g']);

    // Create another recipe with different ingredients
    $recipe2 = Recipe::factory()
        ->for($user)
        ->create();

    $ingredient2 = Ingredient::factory()->for($user)->create(['name' => 'Rice']);
    $recipe2->ingredients()->attach($ingredient2->id, ['quantity' => 150, 'unit' => 'g']);

    $mealTime = MealTime::query()->first();

    // Create planned meals for week 1
    $week1Date = now()->startOfWeek()->addWeek();
    PlannedMeal::factory()->create([
        'user_id' => $user->id,
        'workspace_id' => $workspace->id,
        'recipe_id' => $recipe->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => $week1Date,
    ]);

    // Add recipe2 to the same week
    PlannedMeal::factory()->create([
        'user_id' => $user->id,
        'workspace_id' => $workspace->id,
        'recipe_id' => $recipe2->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => $week1Date->clone()->addDay(),
    ]);

    // Create planned meal for week 2 with the first recipe
    $week2Date = now()->startOfWeek()->addWeeks(2);
    PlannedMeal::factory()->create([
        'user_id' => $user->id,
        'workspace_id' => $workspace->id,
        'recipe_id' => $recipe->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => $week2Date,
    ]);

    // Verify shopping lists were created
    $shoppingListWeek1 = ShoppingList::query()
        ->where('workspace_id', $workspace->id)
        ->where('week_start', $week1Date->startOfWeek())
        ->first();

    $shoppingListWeek2 = ShoppingList::query()
        ->where('workspace_id', $workspace->id)
        ->where('week_start', $week2Date->startOfWeek())
        ->first();

    expect($shoppingListWeek1)->not->toBeNull();
    expect($shoppingListWeek2)->not->toBeNull();
    expect($shoppingListWeek1->plannedMealIngredients)->toHaveCount(2); // Pasta + Rice
    expect($shoppingListWeek2->plannedMealIngredients)->toHaveCount(1); // Pasta only

    // Delete the first recipe
    $recipe->delete();

    // Refresh shopping lists
    $shoppingListWeek1->refresh();
    $shoppingListWeek2->refresh();

    // Verify week 1 shopping list now only has Rice (from recipe2)
    expect($shoppingListWeek1->plannedMealIngredients)->toHaveCount(1);
    expect($shoppingListWeek1->plannedMealIngredients->first()->ingredient->name)->toBe('Rice');

    // Verify week 2 shopping list is now empty (only had Pasta which was deleted)
    expect($shoppingListWeek2->plannedMealIngredients)->toHaveCount(0);
});

it('does not affect shopping list when deleting a recipe without planned meals', function () {
    // Create a user
    $user = User::factory()->create();
    $workspace = $user->defaultWorkspace();

    // Create two recipes
    $recipe1 = Recipe::factory()
        ->for($user)
        ->create();

    $recipe2 = Recipe::factory()
        ->for($user)
        ->create();

    $ingredient1 = Ingredient::factory()->for($user)->create(['name' => 'Cheese']);
    $recipe1->ingredients()->attach($ingredient1->id, ['quantity' => 100, 'unit' => 'g']);

    $ingredient2 = Ingredient::factory()->for($user)->create(['name' => 'Bread']);
    $recipe2->ingredients()->attach($ingredient2->id, ['quantity' => 2, 'unit' => 'slices']);

    $mealTime = MealTime::query()->first();
    $plannedDate = now()->startOfWeek()->addWeek();

    // Only create planned meal for recipe2
    PlannedMeal::factory()->create([
        'user_id' => $user->id,
        'workspace_id' => $workspace->id,
        'recipe_id' => $recipe2->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => $plannedDate,
    ]);

    // Verify shopping list was created with only recipe2 ingredients
    $shoppingList = ShoppingList::query()
        ->where('workspace_id', $workspace->id)
        ->where('week_start', $plannedDate->startOfWeek())
        ->first();

    expect($shoppingList)->not->toBeNull();
    expect($shoppingList->plannedMealIngredients)->toHaveCount(1);
    expect($shoppingList->plannedMealIngredients->first()->ingredient->name)->toBe('Bread');

    // Delete recipe1 (which has no planned meals)
    $recipe1->delete();

    // Refresh shopping list
    $shoppingList->refresh();

    // Verify shopping list is unchanged (still has Bread from recipe2)
    expect($shoppingList->plannedMealIngredients)->toHaveCount(1);
    expect($shoppingList->plannedMealIngredients->first()->ingredient->name)->toBe('Bread');
});
