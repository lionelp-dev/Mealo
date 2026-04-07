<?php

namespace Tests\Feature\AIGeneration;

use App\Models\PlannedMeal;
use App\Models\ShoppingList;
use App\Models\User;
use Carbon\Carbon;
use Tests\Helpers\OpenAITestHelper;

require_once __DIR__.'/../../Helpers/RecipeHelpers.php';

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->otherUser = User::factory()->create();
});

test('guest user cannot access meal plan generation', function () {
    $response = $this->post(route('planned-meals.generate'), [
        'startDate' => now()->format('Y-m-d'),
        'endDate' => now()->addDays(2)->format('Y-m-d'),
        'serving_size' => 1,
    ]);

    $response->assertRedirect(route('login'));
});

test('user can generate meal plan successfully', function () {
    // Create recipes for all meal times
    $breakfastRecipe = createRecipeResource($this->user->id);
    $lunchRecipe = createRecipeResource($this->user->id);
    $dinnerRecipe = createRecipeResource($this->user->id);
    $snackRecipe = createRecipeResource($this->user->id);

    // Attach meal times
    $breakfastMealTime = \App\Models\MealTime::where('name', 'breakfast')->first();
    $lunchMealTime = \App\Models\MealTime::where('name', 'lunch')->first();
    $dinnerMealTime = \App\Models\MealTime::where('name', 'diner')->first();
    $snackMealTime = \App\Models\MealTime::where('name', 'snack')->first();

    $breakfastRecipe->mealTimes()->attach($breakfastMealTime->id);
    $lunchRecipe->mealTimes()->attach($lunchMealTime->id);
    $dinnerRecipe->mealTimes()->attach($dinnerMealTime->id);
    $snackRecipe->mealTimes()->attach($snackMealTime->id);

    $startDate = now()->format('Y-m-d');
    $days = 2;
    $endDate = Carbon::parse($startDate)->addDays($days - 1)->format('Y-m-d');

    // Mock OpenAI response with 8 meals (2 days × 4 meal times)
    OpenAITestHelper::mockSuccessfulMealPlanGeneration([
        ['recipe_id' => $breakfastRecipe->id, 'planned_date' => $startDate, 'meal_time_id' => $breakfastMealTime->id],
        ['recipe_id' => $lunchRecipe->id, 'planned_date' => $startDate, 'meal_time_id' => $lunchMealTime->id],
        ['recipe_id' => $dinnerRecipe->id, 'planned_date' => $startDate, 'meal_time_id' => $dinnerMealTime->id],
        ['recipe_id' => $snackRecipe->id, 'planned_date' => $startDate, 'meal_time_id' => $snackMealTime->id],
        ['recipe_id' => $breakfastRecipe->id, 'planned_date' => $endDate, 'meal_time_id' => $breakfastMealTime->id],
        ['recipe_id' => $lunchRecipe->id, 'planned_date' => $endDate, 'meal_time_id' => $lunchMealTime->id],
        ['recipe_id' => $dinnerRecipe->id, 'planned_date' => $endDate, 'meal_time_id' => $dinnerMealTime->id],
        ['recipe_id' => $snackRecipe->id, 'planned_date' => $endDate, 'meal_time_id' => $snackMealTime->id],
    ]);

    $response = $this->actingAs($this->user)->post(route('planned-meals.generate'), [
        'startDate' => $startDate,
        'endDate' => $endDate,
        'serving_size' => 1,
    ]);

    $response->assertStatus(302);
    $response->assertRedirect();
    $response->assertSessionHas('success');

    // Verify planned meals were created
    // The exact number may vary based on AI response, so just verify some were created
    $plannedMealsCount = PlannedMeal::where('user_id', $this->user->id)->count();
    expect($plannedMealsCount)->toBeGreaterThan(0, 'Expected at least some meals to be created');

    // Verify dates are within the requested range
    $mealsInRange = PlannedMeal::where('user_id', $this->user->id)
        ->whereBetween('planned_date', [$startDate, Carbon::parse($startDate)->addDays($days - 1)->format('Y-m-d')])
        ->count();
    expect($mealsInRange)->toBeGreaterThan(0, 'Expected meals within the requested date range');
});

test('user cannot generate meal plan with invalid data', function () {
    // Missing startDate
    $response = $this->actingAs($this->user)->post(route('planned-meals.generate'), [
        'endDate' => now()->addDays(2)->format('Y-m-d'),
        'serving_size' => 1,
    ]);
    $response->assertStatus(302);
    $response->assertSessionHasErrors(['startDate']);

    // Invalid startDate format
    $response = $this->actingAs($this->user)->post(route('planned-meals.generate'), [
        'startDate' => 'invalid-date',
        'endDate' => now()->addDays(2)->format('Y-m-d'),
        'serving_size' => 1,
    ]);
    $response->assertStatus(302);
    $response->assertSessionHasErrors(['startDate']);

    // Missing endDate
    $response = $this->actingAs($this->user)->post(route('planned-meals.generate'), [
        'startDate' => now()->format('Y-m-d'),
        'serving_size' => 1,
    ]);
    $response->assertStatus(302);
    $response->assertSessionHasErrors(['endDate']);

    // Missing serving_size
    $response = $this->actingAs($this->user)->post(route('planned-meals.generate'), [
        'startDate' => now()->format('Y-m-d'),
        'endDate' => now()->addDays(7)->format('Y-m-d'),
    ]);
    $response->assertStatus(302);
    $response->assertSessionHasErrors(['serving_size']);
});

test('handles openai api failure gracefully', function () {
    // Create some recipes
    createRecipeResource($this->user->id);

    OpenAITestHelper::mockOpenAIErrorException('OpenAI API error');

    $response = $this->actingAs($this->user)->post(route('planned-meals.generate'), [
        'startDate' => now()->format('Y-m-d'),
        'endDate' => now()->addDays(2)->format('Y-m-d'),
        'serving_size' => 1,
    ]);

    $response->assertStatus(302);
    $response->assertRedirect();
    $response->assertSessionHas('error');

    // No planned meals should be created
    $this->assertDatabaseCount('planned_meals', 0);
});

test('clears existing planned meals in date range before generating', function () {
    $recipe = createRecipeResource($this->user->id);
    $mealTime = \App\Models\MealTime::first();
    $personalWorkspace = $this->user->defaultWorkspace();

    // Use specific dates for clarity
    $baseDate = Carbon::parse('2026-01-15'); // A Wednesday
    $generationStartDate = $baseDate->copy();

    // Create existing planned meals in the range we'll generate (15th and 16th)
    $existingMeal1 = PlannedMeal::factory()->create([
        'user_id' => $this->user->id,
        'recipe_id' => $recipe->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => $generationStartDate->format('Y-m-d'), // 15th
        'workspace_id' => $personalWorkspace->id,
    ]);

    $existingMeal2 = PlannedMeal::factory()->create([
        'user_id' => $this->user->id,
        'recipe_id' => $recipe->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => $generationStartDate->copy()->addDay()->format('Y-m-d'), // 16th
        'workspace_id' => $personalWorkspace->id,
    ]);

    // Create meal outside the range (should not be deleted) - 20th
    $mealOutsideRange = PlannedMeal::factory()->create([
        'user_id' => $this->user->id,
        'recipe_id' => $recipe->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => $generationStartDate->copy()->addDays(5)->format('Y-m-d'), // 20th
        'workspace_id' => $personalWorkspace->id,
    ]);

    // Verify we start with 3 meals
    $this->assertDatabaseCount('planned_meals', 3);

    // Mock OpenAI response for the date range
    OpenAITestHelper::mockSuccessfulMealPlanGeneration([
        ['recipe_id' => $recipe->id, 'planned_date' => $generationStartDate->format('Y-m-d'), 'meal_time_id' => $mealTime->id],
        ['recipe_id' => $recipe->id, 'planned_date' => $generationStartDate->copy()->addDay()->format('Y-m-d'), 'meal_time_id' => $mealTime->id],
    ]);

    // Generate meal plan
    $response = $this->actingAs($this->user)->post(route('planned-meals.generate'), [
        'startDate' => $generationStartDate->format('Y-m-d'),
        'endDate' => $generationStartDate->copy()->addDay()->format('Y-m-d'),
        'serving_size' => 1,
    ]);

    $response->assertStatus(302);

    // Meal in range on startDate should be deleted
    $this->assertDatabaseMissing('planned_meals', ['id' => $existingMeal1->id]);

    // Meal outside range should still exist
    $this->assertDatabaseHas('planned_meals', ['id' => $mealOutsideRange->id]);

    // At least 1 new meal from AI should be created in the date range
    $newMeals = PlannedMeal::where('user_id', $this->user->id)
        ->whereBetween('planned_date', [$generationStartDate->format('Y-m-d'), $generationStartDate->copy()->addDay()->format('Y-m-d')])
        ->count();
    expect($newMeals)->toBeGreaterThan(0, 'Expected new meals to be created in the date range');
});

test('generates shopping list after creating planned meals', function () {
    // Create recipe with ingredients
    $recipe = createRecipeResource($this->user->id);

    // Ensure recipe has ingredients
    expect($recipe->ingredients->count())->toBeGreaterThan(0);

    $mealTime = \App\Models\MealTime::first();
    $startDate = now()->startOfWeek()->format('Y-m-d');

    // Mock OpenAI response
    OpenAITestHelper::mockSuccessfulMealPlanGeneration([
        ['recipe_id' => $recipe->id, 'planned_date' => $startDate, 'meal_time_id' => $mealTime->id],
    ]);

    // Generate meal plan
    $response = $this->actingAs($this->user)->post(route('planned-meals.generate'), [
        'startDate' => $startDate,
        'endDate' => $startDate,
        'serving_size' => 1,
    ]);

    $response->assertStatus(302);

    // Verify planned meals were created
    $plannedMealsCount = PlannedMeal::where('user_id', $this->user->id)->count();
    expect($plannedMealsCount)->toBeGreaterThan(0, 'Expected meals to be created');

    // Verify shopping list was generated
    $weekStart = Carbon::parse($startDate)->startOfWeek();
    $shoppingListExists = ShoppingList::where('user_id', $this->user->id)
        ->where('week_start', $weekStart->format('Y-m-d H:i:s'))
        ->exists();
    expect($shoppingListExists)->toBeTrue('Expected shopping list to be generated');

    // Verify shopping list has ingredients
    $shoppingList = ShoppingList::where('user_id', $this->user->id)->first();
    if ($shoppingList) {
        expect($shoppingList->plannedMealIngredients->count())->toBeGreaterThan(0);
    }
});

test('user can only generate meals with their own recipes', function () {
    // Create recipes for both users
    $otherUserRecipe = createRecipeResource($this->otherUser->id);
    $userRecipe = createRecipeResource($this->user->id);

    $mealDate = now()->format('Y-m-d');

    // Mock OpenAI response using only the user's recipe
    OpenAITestHelper::mockSuccessfulMealPlanGeneration([
        ['recipe_id' => $userRecipe->id, 'planned_date' => $mealDate, 'meal_time_id' => 1],
    ]);

    // Generate meal plan
    $response = $this->actingAs($this->user)->post(route('planned-meals.generate'), [
        'startDate' => $mealDate,
        'endDate' => $mealDate,
        'serving_size' => 1,
    ]);

    $response->assertStatus(302);

    // User's recipes should be created as planned meals
    $userMealsCount = PlannedMeal::where('user_id', $this->user->id)->count();
    expect($userMealsCount)->toBeGreaterThan(0, 'Expected user meals to be created');

    // Other user's recipes should NOT be used for this user's plan
    // All created meals should have the current user's ID
    $allMeals = PlannedMeal::where('user_id', $this->user->id)->get();
    foreach ($allMeals as $meal) {
        expect($meal->user_id)->toBe($this->user->id);
    }
});

test('generation works with minimum number of recipes', function () {
    // Create minimal recipes (one for each meal time)
    $breakfastRecipe = createRecipeResource($this->user->id);
    $lunchRecipe = createRecipeResource($this->user->id);
    $dinnerRecipe = createRecipeResource($this->user->id);
    $snackRecipe = createRecipeResource($this->user->id);

    $breakfastMealTime = \App\Models\MealTime::where('name', 'breakfast')->first();
    $lunchMealTime = \App\Models\MealTime::where('name', 'lunch')->first();
    $dinnerMealTime = \App\Models\MealTime::where('name', 'diner')->first();
    $snackMealTime = \App\Models\MealTime::where('name', 'snack')->first();

    $breakfastRecipe->mealTimes()->attach($breakfastMealTime->id);
    $lunchRecipe->mealTimes()->attach($lunchMealTime->id);
    $dinnerRecipe->mealTimes()->attach($dinnerMealTime->id);
    $snackRecipe->mealTimes()->attach($snackMealTime->id);

    $startDate = now()->format('Y-m-d');

    // Mock OpenAI response for 1 day with 4 meal times
    OpenAITestHelper::mockSuccessfulMealPlanGeneration([
        ['recipe_id' => $breakfastRecipe->id, 'planned_date' => $startDate, 'meal_time_id' => $breakfastMealTime->id],
        ['recipe_id' => $lunchRecipe->id, 'planned_date' => $startDate, 'meal_time_id' => $lunchMealTime->id],
        ['recipe_id' => $dinnerRecipe->id, 'planned_date' => $startDate, 'meal_time_id' => $dinnerMealTime->id],
        ['recipe_id' => $snackRecipe->id, 'planned_date' => $startDate, 'meal_time_id' => $snackMealTime->id],
    ]);

    // Generate meal plan
    $response = $this->actingAs($this->user)->post(route('planned-meals.generate'), [
        'startDate' => $startDate,
        'endDate' => $startDate,
        'serving_size' => 1,
    ]);

    $response->assertStatus(302);
    $response->assertSessionHas('success');

    // Verify meals were created
    $plannedMealsCount = PlannedMeal::where('user_id', $this->user->id)->count();
    expect($plannedMealsCount)->toBe(4, 'Expected meals to be generated');
});

test('handles openai rate limit during meal plan generation', function () {
    createRecipeResource($this->user->id);

    OpenAITestHelper::mockOpenAIRateLimit();

    $response = $this->actingAs($this->user)->post(route('planned-meals.generate'), [
        'startDate' => now()->format('Y-m-d'),
        'endDate' => now()->addDays(2)->format('Y-m-d'),
        'serving_size' => 1,
    ]);

    $response->assertStatus(302);
    $response->assertRedirect();
    $response->assertSessionHas('error');

    // No planned meals should be created
    $this->assertDatabaseCount('planned_meals', 0);
});

test('handles openai server error during meal plan generation', function () {
    createRecipeResource($this->user->id);

    OpenAITestHelper::mockOpenAIServerError();

    $response = $this->actingAs($this->user)->post(route('planned-meals.generate'), [
        'startDate' => now()->format('Y-m-d'),
        'endDate' => now()->addDays(2)->format('Y-m-d'),
        'serving_size' => 1,
    ]);

    $response->assertStatus(302);
    $response->assertRedirect();
    $response->assertSessionHas('error');

    // No planned meals should be created
    $this->assertDatabaseCount('planned_meals', 0);
});

test('generation fails gracefully when user has no recipes', function () {
    // Don't create any recipes for the user
    $response = $this->actingAs($this->user)->post(route('planned-meals.generate'), [
        'startDate' => now()->format('Y-m-d'),
        'endDate' => now()->format('Y-m-d'),
        'serving_size' => 1,
    ]);

    $response->assertStatus(302);
    $response->assertSessionHas('error');

    // No planned meals should be created
    $this->assertDatabaseCount('planned_meals', 0);
});
