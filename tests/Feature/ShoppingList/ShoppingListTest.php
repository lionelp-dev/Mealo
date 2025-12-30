<?php

namespace Tests\Feature\ShoppingList;

/** @var \Tests\TestCase $this */

use App\Models\ShoppingList;
use App\Models\ShoppingListIngredient;
use Database\Seeders\MealTimeSeeder;
use Carbon\Carbon;

require_once __DIR__ . '/../../Helpers/RecipeHelpers.php';

beforeEach(function () {
    $this->user = \App\Models\User::factory()->create();
    $this->seed(MealTimeSeeder::class);
});

test('user shopping list screen can be rendered', function () {
    $response = $this->actingAs($this->user)->get(route('shopping-lists.index'));
    $response->assertStatus(200);

    $response->assertInertia(
        fn($page) => $page
            ->component('shopping-lists/index')
            ->has('shoppingList')
            ->has('weekStart')
    );
});

test('shopping list is automatically generated when planned meal is created', function () {
    $recipe = createRecipeResource($this->user->id);
    $mealTime = \App\Models\MealTime::first();
    $plannedDate = now()->startOfWeek()->addDays(1)->format('Y-m-d');

    // Verify recipe has ingredients
    expect($recipe->resource->ingredients->count())->toBeGreaterThan(0);

    $plannedMeal = [
        'recipe_id' => $recipe->resource->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => $plannedDate,
    ];

    $response = $this->actingAs($this->user)->post(route('planned-meals.store'), ['planned_meals' => [$plannedMeal]]);
    $response->assertStatus(302);

    // Shopping list should be auto-generated for the week
    $weekStart = Carbon::parse($plannedDate)->startOfWeek();

    // Check shopping list was created
    $shoppingList = ShoppingList::where('user_id', $this->user->id)
        ->whereDate('week_start', $weekStart->toDateString())
        ->first();

    expect($shoppingList)->not->toBeNull();

    // Refresh to load relationships
    $shoppingList->load('ingredients');

    // Shopping list should contain ingredients from the recipe
    expect($shoppingList->ingredients->count())->toBe($recipe->resource->ingredients->count());
});

test('shopping list ingredients are aggregated by ingredient and unit', function () {
    // Create two recipes with overlapping ingredients
    $recipe1 = createRecipeResource($this->user->id);
    $recipe2 = createRecipeResource($this->user->id);

    // Clear existing ingredients from recipes to have controlled test data
    $recipe1->resource->ingredients()->detach();
    $recipe2->resource->ingredients()->detach();

    // Manually create ingredients for consistent testing
    $ingredient1 = \App\Models\Ingredient::factory()->create([
        'user_id' => $this->user->id,
        'name' => 'Tomatoes'
    ]);
    $ingredient2 = \App\Models\Ingredient::factory()->create([
        'user_id' => $this->user->id,
        'name' => 'Onions'
    ]);

    // Attach same ingredient to both recipes with different quantities
    $recipe1->resource->ingredients()->attach($ingredient1->id, [
        'quantity' => '2',
        'unit' => 'pieces'
    ]);
    $recipe1->resource->ingredients()->attach($ingredient2->id, [
        'quantity' => '1',
        'unit' => 'pieces'
    ]);

    $recipe2->resource->ingredients()->attach($ingredient1->id, [
        'quantity' => '3',
        'unit' => 'pieces'
    ]);
    $recipe2->resource->ingredients()->attach($ingredient2->id, [
        'quantity' => '2',
        'unit' => 'kg'
    ]); // Different unit should not aggregate

    $mealTime = \App\Models\MealTime::first();
    $plannedDate = now()->startOfWeek()->addDays(1)->format('Y-m-d');

    // Create planned meals directly without going through HTTP controllers to avoid hook issues
    \App\Models\PlannedMeal::create([
        'user_id' => $this->user->id,
        'recipe_id' => $recipe1->resource->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => $plannedDate,
    ]);

    \App\Models\PlannedMeal::create([
        'user_id' => $this->user->id,
        'recipe_id' => $recipe2->resource->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => $plannedDate,
    ]);

    $weekStart = Carbon::parse($plannedDate)->startOfWeek();

    // Verify we have both planned meals
    $plannedMealsCount = \App\Models\PlannedMeal::where('user_id', $this->user->id)
        ->whereBetween('planned_date', [$weekStart->toDateString(), $weekStart->copy()->endOfWeek()->toDateString()])
        ->count();
    expect($plannedMealsCount)->toBe(2);

    // Generate shopping list for testing aggregation logic
    $shoppingListService = app(\App\Services\ShoppingListService::class);
    $shoppingList = $shoppingListService->generateShoppingListForWeek($this->user->id, $weekStart);

    // Should have 3 shopping list ingredients:
    // - Tomatoes (5 pieces) - aggregated from recipe1 (2) + recipe2 (3)
    // - Onions (1 pieces) - from recipe1 only
    // - Onions (2 kg) - from recipe2 only (different unit)
    expect($shoppingList->ingredients)->toHaveCount(3);

    $tomatoesEntry = $shoppingList->ingredients->where('ingredient_id', $ingredient1->id)->where('unit', 'pieces')->first();
    expect($tomatoesEntry->quantity)->toBe('5.00');

    $onionsPiecesEntry = $shoppingList->ingredients->where('ingredient_id', $ingredient2->id)->where('unit', 'pieces')->first();
    expect($onionsPiecesEntry->quantity)->toBe('1.00');

    $onionsKgEntry = $shoppingList->ingredients->where('ingredient_id', $ingredient2->id)->where('unit', 'kg')->first();
    expect($onionsKgEntry->quantity)->toBe('2.00');
});

test('shopping list regenerates when planned meal is updated', function () {
    $recipe1 = createRecipeResource($this->user->id);
    $recipe2 = createRecipeResource($this->user->id);
    $mealTime = \App\Models\MealTime::first();
    $plannedDate = now()->startOfWeek()->addDays(1)->format('Y-m-d');

    // Create planned meal
    $plannedMeal = \App\Models\PlannedMeal::factory()->create([
        'user_id' => $this->user->id,
        'recipe_id' => $recipe1->resource->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => $plannedDate,
    ]);

    // Manually generate shopping list (since we bypassed the controller)
    $shoppingListService = app(\App\Services\ShoppingListService::class);
    $shoppingListService->regenerateAffectedShoppingLists($this->user->id, [$plannedDate]);

    // Initial shopping list should be generated
    $weekStart = Carbon::parse($plannedDate)->startOfWeek();
    $initialShoppingList = ShoppingList::where('user_id', $this->user->id)
        ->whereDate('week_start', $weekStart->toDateString())
        ->first();
    expect($initialShoppingList)->not->toBeNull();

    // Update planned meal to use different recipe
    $updateData = [
        'recipe_id' => $recipe2->resource->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => $plannedDate,
    ];

    $this->actingAs($this->user)->put(route('planned-meals.update', $plannedMeal), $updateData);

    // Shopping list should be regenerated with new recipe ingredients
    $updatedShoppingList = ShoppingList::where('user_id', $this->user->id)
        ->whereDate('week_start', $weekStart->toDateString())
        ->first();

    expect($updatedShoppingList->ingredients)->toHaveCount($recipe2->resource->ingredients->count());
});

test('shopping list regenerates when planned meal is deleted', function () {
    $recipe = createRecipeResource($this->user->id);
    $mealTime = \App\Models\MealTime::first();
    $plannedDate = now()->startOfWeek()->addDays(1)->format('Y-m-d');

    // Create planned meal
    $plannedMeal = \App\Models\PlannedMeal::factory()->create([
        'user_id' => $this->user->id,
        'recipe_id' => $recipe->resource->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => $plannedDate,
    ]);

    // Manually generate shopping list (since we bypassed the controller)
    $shoppingListService = app(\App\Services\ShoppingListService::class);
    $shoppingListService->regenerateAffectedShoppingLists($this->user->id, [$plannedDate]);

    // Shopping list should be generated
    $weekStart = Carbon::parse($plannedDate)->startOfWeek();
    $shoppingList = ShoppingList::where('user_id', $this->user->id)
        ->whereDate('week_start', $weekStart->toDateString())
        ->first();
    expect($shoppingList)->not->toBeNull();
    expect($shoppingList->ingredients)->toHaveCount($recipe->resource->ingredients->count());

    // Delete planned meal
    $response = $this->actingAs($this->user)->delete(route('planned-meals.destroy'), [
        'planned_meals' => [$plannedMeal->id]
    ]);
    $response->assertStatus(302); // Should redirect with success message

    // Shopping list should be regenerated (empty if no other planned meals)
    $updatedShoppingList = ShoppingList::where('user_id', $this->user->id)
        ->whereDate('week_start', $weekStart->toDateString())
        ->first();
    $updatedShoppingList->load('ingredients'); // Refresh the relationship
    expect($updatedShoppingList->ingredients)->toHaveCount(0);
});

test('user can toggle ingredient checked status', function () {
    $recipe = createRecipeResource($this->user->id);
    $mealTime = \App\Models\MealTime::first();
    $plannedDate = now()->startOfWeek()->addDays(1)->format('Y-m-d');

    // Create planned meal to generate shopping list
    $this->actingAs($this->user)->post(route('planned-meals.store'), [
        'planned_meals' => [[
            'recipe_id' => $recipe->resource->id,
            'meal_time_id' => $mealTime->id,
            'planned_date' => $plannedDate,
        ]]
    ]);

    $weekStart = Carbon::parse($plannedDate)->startOfWeek();
    $shoppingList = ShoppingList::where('user_id', $this->user->id)
        ->whereDate('week_start', $weekStart->toDateString())
        ->first();

    $ingredient = $shoppingList->ingredients->first();
    expect($ingredient->is_checked)->toBeFalse();

    // Toggle ingredient to checked
    $response = $this->actingAs($this->user)->put(
        route('shopping-lists.toggle-ingredient', $ingredient->id),
        ['is_checked' => true]
    );

    $response->assertStatus(302);
    $response->assertSessionHas('success');

    $ingredient->refresh();
    expect($ingredient->is_checked)->toBeTrue();

    // Toggle ingredient back to unchecked
    $response = $this->actingAs($this->user)->put(
        route('shopping-lists.toggle-ingredient', $ingredient->id),
        ['is_checked' => false]
    );

    $response->assertStatus(302);
    $ingredient->refresh();
    expect($ingredient->is_checked)->toBeFalse();
});

test('checked status is preserved during shopping list regeneration', function () {
    $recipe1 = createRecipeResource($this->user->id);
    $recipe2 = createRecipeResource($this->user->id);
    $mealTime = \App\Models\MealTime::first();
    $plannedDate = now()->startOfWeek()->addDays(1)->format('Y-m-d');

    // Create common ingredient for both recipes
    $commonIngredient = \App\Models\Ingredient::factory()->create([
        'user_id' => $this->user->id,
        'name' => 'Salt'
    ]);

    $recipe1->resource->ingredients()->attach($commonIngredient->id, [
        'quantity' => '1',
        'unit' => 'tsp'
    ]);
    $recipe2->resource->ingredients()->attach($commonIngredient->id, [
        'quantity' => '2',
        'unit' => 'tsp'
    ]);

    // Create first planned meal
    $plannedMeal1 = \App\Models\PlannedMeal::factory()->create([
        'user_id' => $this->user->id,
        'recipe_id' => $recipe1->resource->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => $plannedDate,
    ]);

    // Manually generate shopping list (since we bypassed the controller)
    $shoppingListService = app(\App\Services\ShoppingListService::class);
    $shoppingListService->regenerateAffectedShoppingLists($this->user->id, [$plannedDate]);

    $weekStart = Carbon::parse($plannedDate)->startOfWeek();
    $shoppingList = ShoppingList::where('user_id', $this->user->id)
        ->whereDate('week_start', $weekStart->toDateString())
        ->first();

    // Check the salt ingredient
    $saltIngredient = $shoppingList->ingredients
        ->where('ingredient_id', $commonIngredient->id)
        ->where('unit', 'tsp')
        ->first();

    $this->actingAs($this->user)->put(
        route('shopping-lists.toggle-ingredient', $saltIngredient->id),
        ['is_checked' => true]
    );

    // Add second planned meal with same ingredient
    $plannedMeal2 = \App\Models\PlannedMeal::factory()->create([
        'user_id' => $this->user->id,
        'recipe_id' => $recipe2->resource->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => $plannedDate,
    ]);

    // Manually regenerate shopping list (since we bypassed the controller)
    $shoppingListService->regenerateAffectedShoppingLists($this->user->id, [$plannedDate]);

    // Shopping list should regenerate but preserve checked status
    $shoppingList->refresh();
    $saltIngredient = $shoppingList->ingredients
        ->where('ingredient_id', $commonIngredient->id)
        ->where('unit', 'tsp')
        ->first();

    expect($saltIngredient->is_checked)->toBeTrue();
    expect($saltIngredient->quantity)->toBe('3.00'); // 1 + 2 tsp aggregated
});

test('user cannot access other users shopping lists', function () {
    $otherUser = \App\Models\User::factory()->create();
    $recipe = createRecipeResource($otherUser->id);
    $mealTime = \App\Models\MealTime::first();
    $plannedDate = now()->startOfWeek()->addDays(1)->format('Y-m-d');

    // Create planned meal for other user
    $otherUserPlannedMeal = \App\Models\PlannedMeal::factory()->create([
        'user_id' => $otherUser->id,
        'recipe_id' => $recipe->resource->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => $plannedDate,
    ]);

    // Manually generate shopping list for other user (since we bypassed the controller)
    $shoppingListService = app(\App\Services\ShoppingListService::class);
    $shoppingListService->regenerateAffectedShoppingLists($otherUser->id, [$plannedDate]);

    $weekStart = Carbon::parse($plannedDate)->startOfWeek();
    $otherUserShoppingList = ShoppingList::where('user_id', $otherUser->id)
        ->whereDate('week_start', $weekStart->toDateString())
        ->first();

    $otherUserIngredient = $otherUserShoppingList->ingredients->first();

    // Current user should not be able to toggle other user's shopping list ingredient
    $response = $this->actingAs($this->user)->put(
        route('shopping-lists.toggle-ingredient', $otherUserIngredient->id),
        ['is_checked' => true]
    );

    $response->assertStatus(403);

    // Ingredient should remain unchanged
    $otherUserIngredient->refresh();
    expect($otherUserIngredient->is_checked)->toBeFalse();
});

test('shopping list only shows current week by default', function () {
    $recipe = createRecipeResource($this->user->id);
    $mealTime = \App\Models\MealTime::first();

    // Create planned meals for different weeks
    $thisWeekDate = now()->startOfWeek()->addDays(1)->format('Y-m-d');
    $nextWeekDate = now()->startOfWeek()->addWeek()->addDays(1)->format('Y-m-d');

    $this->actingAs($this->user)->post(route('planned-meals.store'), [
        'planned_meals' => [[
            'recipe_id' => $recipe->resource->id,
            'meal_time_id' => $mealTime->id,
            'planned_date' => $thisWeekDate,
        ]]
    ]);

    $this->actingAs($this->user)->post(route('planned-meals.store'), [
        'planned_meals' => [[
            'recipe_id' => $recipe->resource->id,
            'meal_time_id' => $mealTime->id,
            'planned_date' => $nextWeekDate,
        ]]
    ]);

    // Should have shopping lists for both weeks
    $thisWeekStart = Carbon::parse($thisWeekDate)->startOfWeek();
    $nextWeekStart = Carbon::parse($nextWeekDate)->startOfWeek();

    $this->assertDatabaseHas('shopping_lists', [
        'user_id' => $this->user->id,
        'week_start' => $thisWeekStart->format('Y-m-d') . ' 00:00:00',
    ]);

    $this->assertDatabaseHas('shopping_lists', [
        'user_id' => $this->user->id,
        'week_start' => $nextWeekStart->format('Y-m-d') . ' 00:00:00',
    ]);

    // Default API call should return current week
    $response = $this->actingAs($this->user)->get(route('shopping-lists.index'));
    $response->assertStatus(200);

    $response->assertInertia(function ($page) use ($thisWeekStart) {
        expect($page->toArray()['props']['weekStart'])->toBe($thisWeekStart->format('Y-m-d'));
        return true;
    });
});

test('shopping list can be filtered by week', function () {
    $recipe = createRecipeResource($this->user->id);
    $mealTime = \App\Models\MealTime::first();

    $nextWeekDate = now()->startOfWeek()->addWeek()->addDays(1)->format('Y-m-d');

    $this->actingAs($this->user)->post(route('planned-meals.store'), [
        'planned_meals' => [[
            'recipe_id' => $recipe->resource->id,
            'meal_time_id' => $mealTime->id,
            'planned_date' => $nextWeekDate,
        ]]
    ]);

    $nextWeekStart = Carbon::parse($nextWeekDate)->startOfWeek();

    // Request specific week
    $response = $this->actingAs($this->user)->get(
        route('shopping-lists.index', ['week' => $nextWeekStart->format('Y-m-d')])
    );

    $response->assertStatus(200);
    $response->assertInertia(function ($page) use ($nextWeekStart) {
        expect($page->toArray()['props']['weekStart'])->toBe($nextWeekStart->format('Y-m-d'));
        return true;
    });
});

test('empty shopping list is returned when no planned meals for week', function () {
    // No planned meals created
    $response = $this->actingAs($this->user)->get(route('shopping-lists.index'));

    $response->assertStatus(200);
    $response->assertInertia(function ($page) {
        $shoppingList = $page->toArray()['props']['shoppingList'];
        expect($shoppingList)->toBeNull();
        return true;
    });
});

test('user cannot toggle ingredient with invalid data', function () {
    $recipe = createRecipeResource($this->user->id);
    $mealTime = \App\Models\MealTime::first();
    $plannedDate = now()->startOfWeek()->addDays(1)->format('Y-m-d');

    // Create planned meal to generate shopping list
    $this->actingAs($this->user)->post(route('planned-meals.store'), [
        'planned_meals' => [[
            'recipe_id' => $recipe->resource->id,
            'meal_time_id' => $mealTime->id,
            'planned_date' => $plannedDate,
        ]]
    ]);

    $weekStart = Carbon::parse($plannedDate)->startOfWeek();
    $shoppingList = ShoppingList::where('user_id', $this->user->id)
        ->whereDate('week_start', $weekStart->toDateString())
        ->first();

    $ingredient = $shoppingList->ingredients->first();

    // Test with invalid data
    $response = $this->actingAs($this->user)->put(
        route('shopping-lists.toggle-ingredient', $ingredient->id),
        ['is_checked' => 'invalid']
    );

    $response->assertStatus(302);
    $response->assertSessionHasErrors(['is_checked']);

    // Test with missing data
    $response = $this->actingAs($this->user)->put(
        route('shopping-lists.toggle-ingredient', $ingredient->id),
        []
    );

    $response->assertStatus(302);
    $response->assertSessionHasErrors(['is_checked']);
});

test('multiple planned meal operations properly regenerate shopping lists', function () {
    $recipe1 = createRecipeResource($this->user->id);
    $recipe2 = createRecipeResource($this->user->id);
    $mealTime = \App\Models\MealTime::first();
    $plannedDate = now()->startOfWeek()->addDays(1)->format('Y-m-d');

    // Test multiple store
    $plannedMealsData = [
        'planned_meals' => [
            [
                'recipe_id' => $recipe1->resource->id,
                'meal_time_id' => $mealTime->id,
                'planned_date' => $plannedDate,
            ],
            [
                'recipe_id' => $recipe2->resource->id,
                'meal_time_id' => $mealTime->id,
                'planned_date' => $plannedDate,
            ]
        ]
    ];

    $this->actingAs($this->user)->post(route('planned-meals.store'), $plannedMealsData);

    $weekStart = Carbon::parse($plannedDate)->startOfWeek();
    $shoppingList = ShoppingList::where('user_id', $this->user->id)
        ->whereDate('week_start', $weekStart->toDateString())
        ->first();

    expect($shoppingList)->not->toBeNull();
    $initialIngredientCount = $shoppingList->ingredients->count();

    // Create planned meals for bulk delete
    $plannedMeal1 = \App\Models\PlannedMeal::where('user_id', $this->user->id)
        ->where('recipe_id', $recipe1->resource->id)->first();
    $plannedMeal2 = \App\Models\PlannedMeal::where('user_id', $this->user->id)
        ->where('recipe_id', $recipe2->resource->id)->first();

    // Test multiple delete
    $this->actingAs($this->user)->delete(route('planned-meals.destroy'), [
        'planned_meals' => [$plannedMeal1->id, $plannedMeal2->id]
    ]);

    // Shopping list should be regenerated (empty)
    $shoppingList->refresh();
    $shoppingList->load('ingredients'); // Refresh the relationship
    expect($shoppingList->ingredients)->toHaveCount(0);
});
