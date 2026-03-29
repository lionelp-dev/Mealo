<?php

namespace Tests\Feature\MealPlanning;

/** @var \Tests\TestCase $this */

use Database\Seeders\MealTimeSeeder;

require_once __DIR__.'/../../Helpers/RecipeHelpers.php';

beforeEach(function () {
    // Seed roles and permissions first
    $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);

    $this->user = \App\Models\User::factory()->create();
    \App\Models\Workspace::createPersonalWorkspace($this->user);

    $this->seed(MealTimeSeeder::class);
});

test('user planned meals screen can be rendered', function () {
    $recipe = createRecipeResource($this->user->id);
    $mealTime = \App\Models\MealTime::first();
    $workspace = $this->user->getPersonalWorkspace();

    \App\Models\PlannedMeal::factory()->create([
        'user_id' => $this->user->id,
        'recipe_id' => $recipe->id,
        'meal_time_id' => $mealTime->id,
        'workspace_id' => $workspace->id,
        'planned_date' => now()->startOfWeek()->addDays(1)->format('Y-m-d'),
    ]);

    $response = $this->actingAs($this->user)->get(route('planned-meals.index'));
    $response->assertStatus(200);

    $response->assertInertia(
        fn ($page) => $page
            ->component('planned-meals/index')
            ->has('plannedMeals')
            ->has('weekStart')
            ->has('mealTimes')
            ->has('tags')
            ->where('plannedMeals.0.recipe.name', $recipe->name)
    );
});

test('user can plan a meal successfully', function () {
    $recipe = createRecipeResource($this->user->id);
    $mealTime = \App\Models\MealTime::first();
    $plannedDate = now()->addDay()->format('Y-m-d');

    $plannedMeal = [
        'recipe_id' => $recipe->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => $plannedDate,
        'serving_size' => 1,
    ];

    $response = $this->actingAs($this->user)->post(route('planned-meals.store'), ['planned_meals' => [$plannedMeal]]);

    $response->assertStatus(302);
    $response->assertSessionHas('success', 'Meal successfully planned');
    $response->assertRedirect();

    $this->assertDatabaseHas('planned_meals', [
        'user_id' => $this->user->id,
        'recipe_id' => $recipe->id,
        'meal_time_id' => $mealTime->id,
    ]);
});

test('user cannot plan meal with invalid data', function () {
    // Empty data should fail validation
    $response = $this->actingAs($this->user)->post(route('planned-meals.store'), []);
    $response->assertStatus(302);
    $response->assertSessionHasErrors(['planned_meals']);

    // Invalid data types should fail validation
    $response = $this->actingAs($this->user)->post(route('planned-meals.store'), [
        'planned_meals' => [[
            'recipe_id' => 'invalid',
            'planned_date' => 'invalid-date',
            'meal_time_id' => 'invalid',
        ]],
    ]);
    $response->assertStatus(302);
    $response->assertSessionHasErrors(['planned_meals.0.recipe_id', 'planned_meals.0.planned_date', 'planned_meals.0.meal_time_id']);

    // Non-existent IDs should fail validation
    $response = $this->actingAs($this->user)->post(route('planned-meals.store'), [
        'planned_meals' => [[
            'recipe_id' => 999999,
            'planned_date' => now()->format('Y-m-d'),
            'meal_time_id' => 999999,
        ]],
    ]);
    $response->assertStatus(302);
    $response->assertSessionHasErrors(['planned_meals.0.recipe_id', 'planned_meals.0.meal_time_id']);

    // No planned meal should be created after failed validations
    $this->assertDatabaseMissing('planned_meals', [
        'user_id' => $this->user->id,
    ]);
});

test('user can create planned meal with other users recipe in their workspace', function () {
    $otherUser = \App\Models\User::factory()->create();
    $otherRecipe = createRecipeResource($otherUser->id);
    $mealTime = \App\Models\MealTime::first();

    $plannedMeal = [
        'recipe_id' => $otherRecipe->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => now()->addDay()->format('Y-m-d'),
        'serving_size' => 1,
    ];

    $response = $this->actingAs($this->user)->post(route('planned-meals.store'), ['planned_meals' => [$plannedMeal]]);

    // Should succeed - users can plan meals with any recipe in their workspace
    $response->assertStatus(302);
    $response->assertSessionHas('success');
    $this->assertDatabaseHas('planned_meals', [
        'user_id' => $this->user->id,
        'recipe_id' => $otherRecipe->id,
    ]);
});

test('user can update a planned meal successfully', function () {
    $originalRecipe = createRecipeResource($this->user->id);
    $newRecipe = createRecipeResource($this->user->id);
    $originalMealTime = \App\Models\MealTime::first();
    $newMealTime = \App\Models\MealTime::skip(1)->first();
    $originalDate = now()->addDay()->format('Y-m-d');
    $newDate = now()->addDays(2)->format('Y-m-d');

    $plannedMeal = \App\Models\PlannedMeal::factory()->create([
        'user_id' => $this->user->id,
        'recipe_id' => $originalRecipe->id,
        'meal_time_id' => $originalMealTime->id,
        'planned_date' => $originalDate,
    ]);

    $updateData = [
        'recipe_id' => $newRecipe->id,
        'meal_time_id' => $newMealTime->id,
        'planned_date' => $newDate,
        'serving_size' => 1,
    ];

    $response = $this->actingAs($this->user)->put(route('planned-meals.update', $plannedMeal), $updateData);

    $response->assertStatus(302);
    $response->assertSessionHas('success', 'Planned meal successfully updated');
    $response->assertRedirect();

    // Verify all fields were updated correctly
    $plannedMeal->refresh();
    expect($plannedMeal->user_id)->toBe($this->user->id);
    expect($plannedMeal->recipe_id)->toBe($newRecipe->id);
    expect($plannedMeal->meal_time_id)->toBe($newMealTime->id);
    expect($plannedMeal->planned_date->format('Y-m-d'))->toBe($newDate);
});

test('user cannot update planned meal with other users recipe', function () {
    $otherUser = \App\Models\User::factory()->create();
    $otherRecipe = createRecipeResource($otherUser->id);
    $ownRecipe = createRecipeResource($this->user->id);
    $mealTime = \App\Models\MealTime::first();

    $plannedMeal = \App\Models\PlannedMeal::factory()->create([
        'user_id' => $this->user->id,
        'recipe_id' => $ownRecipe->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => now()->addDay()->format('Y-m-d'),
    ]);

    $updateData = [
        'recipe_id' => $otherRecipe->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => now()->addDays(2)->format('Y-m-d'),
        'serving_size' => 1,
    ];

    $response = $this->actingAs($this->user)->put(route('planned-meals.update', $plannedMeal), $updateData);

    // Should be forbidden due to recipe ownership policy
    $response->assertStatus(403);

    // Original recipe should remain unchanged
    $this->assertDatabaseHas('planned_meals', [
        'id' => $plannedMeal->id,
        'recipe_id' => $ownRecipe->id,
    ]);

    // New recipe should not be assigned
    $this->assertDatabaseMissing('planned_meals', [
        'id' => $plannedMeal->id,
        'recipe_id' => $otherRecipe->id,
    ]);
});

test('user can delete a planned meal successfully', function () {
    $recipe = createRecipeResource($this->user->id);
    $mealTime = \App\Models\MealTime::first();
    $plannedDate = now()->addDay()->format('Y-m-d');
    $workspace = $this->user->getPersonalWorkspace();

    $plannedMeal = \App\Models\PlannedMeal::factory()->create([
        'user_id' => $this->user->id,
        'recipe_id' => $recipe->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => $plannedDate,
        'workspace_id' => $workspace->id,
    ]);

    $response = $this->withSession(['current_workspace_id' => $workspace->id])
        ->actingAs($this->user)->delete(route('planned-meals.destroy'), [
            'planned_meals' => [$plannedMeal->id],
        ]);

    $response->assertStatus(302);
    $response->assertSessionHas('success', 'Planned meal successfully deleted');
    $response->assertRedirect();

    // Planned meal should be removed from database
    $this->assertDatabaseMissing('planned_meals', [
        'id' => $plannedMeal->id,
    ]);
});

test('user can store multiple planned meals successfully', function () {
    $recipe1 = createRecipeResource($this->user->id);
    $recipe2 = createRecipeResource($this->user->id);
    $mealTime1 = \App\Models\MealTime::first();
    $mealTime2 = \App\Models\MealTime::skip(1)->first();

    $plannedMealsData = [
        'planned_meals' => [
            [
                'recipe_id' => $recipe1->id,
                'meal_time_id' => $mealTime1->id,
                'planned_date' => now()->addDay()->format('Y-m-d'),
                'serving_size' => 1,
            ],
            [
                'recipe_id' => $recipe2->id,
                'meal_time_id' => $mealTime2->id,
                'planned_date' => now()->addDays(2)->format('Y-m-d'),
                'serving_size' => 1,
            ],
        ],
    ];

    $response = $this->actingAs($this->user)->post(route('planned-meals.store'), $plannedMealsData);

    $response->assertStatus(302);
    $response->assertSessionHas('success', 'Meal successfully planned');
    $response->assertRedirect();

    // Both planned meals should be created
    $this->assertDatabaseHas('planned_meals', [
        'user_id' => $this->user->id,
        'recipe_id' => $recipe1->id,
        'meal_time_id' => $mealTime1->id,
    ]);

    $this->assertDatabaseHas('planned_meals', [
        'user_id' => $this->user->id,
        'recipe_id' => $recipe2->id,
        'meal_time_id' => $mealTime2->id,
    ]);
});

test('user cannot store multiple planned meals with invalid data', function () {
    // Empty array should fail validation
    $response = $this->actingAs($this->user)->post(route('planned-meals.store'), []);
    $response->assertStatus(302);
    $response->assertSessionHasErrors(['planned_meals']);

    // Invalid data in bulk operation should fail
    $response = $this->actingAs($this->user)->post(route('planned-meals.store'), [
        'planned_meals' => [
            [
                'recipe_id' => 'invalid',
                'meal_time_id' => 'invalid',
                'planned_date' => 'invalid-date',
            ],
            [
                'recipe_id' => 999999,
                'meal_time_id' => 999999,
                'planned_date' => 'another-invalid-date',
            ],
        ],
    ]);
    $response->assertStatus(302);

    // Should have validation errors for all invalid fields
    $response->assertSessionHasErrors([
        'planned_meals.0.recipe_id',
        'planned_meals.0.meal_time_id',
        'planned_meals.0.planned_date',
        'planned_meals.1.recipe_id',
        'planned_meals.1.meal_time_id',
        'planned_meals.1.planned_date',
    ]);

    // No planned meals should be created after failed validation
    $this->assertDatabaseMissing('planned_meals', [
        'user_id' => $this->user->id,
    ]);
});

test('user can store multiple planned meals including other users recipes', function () {
    $otherUser = \App\Models\User::factory()->create();
    $otherRecipe = createRecipeResource($otherUser->id);
    $ownRecipe = createRecipeResource($this->user->id);
    $mealTime = \App\Models\MealTime::first();

    $plannedMealsData = [
        'planned_meals' => [
            [
                'recipe_id' => $ownRecipe->id,
                'meal_time_id' => $mealTime->id,
                'planned_date' => now()->addDay()->format('Y-m-d'),
                'serving_size' => 1,
            ],
            [
                'recipe_id' => $otherRecipe->id, // Not owned by user but should work
                'meal_time_id' => $mealTime->id,
                'planned_date' => now()->addDays(2)->format('Y-m-d'),
                'serving_size' => 1,
            ],
        ],
    ];

    $response = $this->actingAs($this->user)->post(route('planned-meals.store'), $plannedMealsData);

    // Should succeed - users can plan meals with any recipe in their workspace
    $response->assertStatus(302);
    $response->assertSessionHas('success');
    $this->assertDatabaseHas('planned_meals', [
        'user_id' => $this->user->id,
        'recipe_id' => $ownRecipe->id,
    ]);
    $this->assertDatabaseHas('planned_meals', [
        'user_id' => $this->user->id,
        'recipe_id' => $otherRecipe->id,
    ]);
});

test('user can delete multiple planned meals successfully', function () {
    $recipe1 = createRecipeResource($this->user->id);
    $recipe2 = createRecipeResource($this->user->id);
    $mealTime = \App\Models\MealTime::first();
    $workspace = $this->user->getPersonalWorkspace();

    $plannedMeal1 = \App\Models\PlannedMeal::factory()->create([
        'user_id' => $this->user->id,
        'recipe_id' => $recipe1->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => now()->addDay()->format('Y-m-d'),
        'workspace_id' => $workspace->id,
    ]);

    $plannedMeal2 = \App\Models\PlannedMeal::factory()->create([
        'user_id' => $this->user->id,
        'recipe_id' => $recipe2->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => now()->addDays(2)->format('Y-m-d'),
        'workspace_id' => $workspace->id,
    ]);

    $response = $this->withSession(['current_workspace_id' => $workspace->id])
        ->actingAs($this->user)->delete(route('planned-meals.destroy'), [
            'planned_meals' => [$plannedMeal1->id, $plannedMeal2->id],
        ]);

    $response->assertStatus(302);
    $response->assertRedirect();
    $response->assertSessionHas('success', 'Planned meals successfully deleted');

    // Both planned meals should be removed from database
    $this->assertDatabaseMissing('planned_meals', [
        'id' => $plannedMeal1->id,
    ]);

    $this->assertDatabaseMissing('planned_meals', [
        'id' => $plannedMeal2->id,
    ]);
});

test('user cannot access other users planned meals', function () {
    $otherUser = \App\Models\User::factory()->create();
    $otherRecipe = createRecipeResource($otherUser->id);
    $mealTime = \App\Models\MealTime::first();

    $otherUserPlannedMeal = \App\Models\PlannedMeal::factory()->create([
        'user_id' => $otherUser->id,
        'recipe_id' => $otherRecipe->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => now()->addDay()->format('Y-m-d'),
    ]);

    // Should not be able to view other user's planned meal
    $response = $this->actingAs($this->user)->get(route('planned-meals.show', $otherUserPlannedMeal));
    $response->assertStatus(403);

    // Should not be able to update other user's planned meal
    $response = $this->actingAs($this->user)->put(route('planned-meals.update', $otherUserPlannedMeal), [
        'recipe_id' => $otherRecipe->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => now()->addDays(2)->format('Y-m-d'),
        'serving_size' => 1,
    ]);
    $response->assertStatus(403);

    // Should not be able to delete other user's planned meal
    $response = $this->actingAs($this->user)->delete(route('planned-meals.destroy'), [
        'planned_meals' => [$otherUserPlannedMeal->id],
    ]);
    $response->assertStatus(403);

    // Other user's planned meal should remain untouched
    $this->assertDatabaseHas('planned_meals', [
        'id' => $otherUserPlannedMeal->id,
        'user_id' => $otherUser->id,
    ]);
});

test('user cannot delete other users planned meals in bulk operation', function () {
    $otherUser = \App\Models\User::factory()->create();
    \App\Models\Workspace::createPersonalWorkspace($otherUser);
    $otherRecipe1 = createRecipeResource($otherUser->id);
    $otherRecipe2 = createRecipeResource($otherUser->id);
    $ownRecipe = createRecipeResource($this->user->id);
    $mealTime = \App\Models\MealTime::first();
    $userWorkspace = $this->user->getPersonalWorkspace();
    $otherWorkspace = $otherUser->getPersonalWorkspace();

    // Create planned meals for other user (in their workspace)
    $otherUserPlannedMeal1 = \App\Models\PlannedMeal::factory()->create([
        'user_id' => $otherUser->id,
        'recipe_id' => $otherRecipe1->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => now()->addDay()->format('Y-m-d'),
        'workspace_id' => $otherWorkspace->id,
    ]);

    $otherUserPlannedMeal2 = \App\Models\PlannedMeal::factory()->create([
        'user_id' => $otherUser->id,
        'recipe_id' => $otherRecipe2->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => now()->addDays(2)->format('Y-m-d'),
        'workspace_id' => $otherWorkspace->id,
    ]);

    // Create own planned meal (in user's workspace)
    $ownPlannedMeal = \App\Models\PlannedMeal::factory()->create([
        'user_id' => $this->user->id,
        'recipe_id' => $ownRecipe->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => now()->addDays(3)->format('Y-m-d'),
        'workspace_id' => $userWorkspace->id,
    ]);

    // Attempt to delete other users' planned meals mixed with own
    $response = $this->withSession(['current_workspace_id' => $userWorkspace->id])
        ->actingAs($this->user)->delete(route('planned-meals.destroy'), [
            'planned_meals' => [
                $ownPlannedMeal->id,
                $otherUserPlannedMeal1->id, // Not owned by user - in different workspace
                $otherUserPlannedMeal2->id, // Not owned by user - in different workspace
            ],
        ]);

    $response->assertStatus(403);

    // All planned meals should remain untouched (no partial deletion)
    $this->assertDatabaseHas('planned_meals', [
        'id' => $ownPlannedMeal->id,
    ]);
    $this->assertDatabaseHas('planned_meals', [
        'id' => $otherUserPlannedMeal1->id,
        'user_id' => $otherUser->id,
    ]);

    $this->assertDatabaseHas('planned_meals', [
        'id' => $otherUserPlannedMeal2->id,
        'user_id' => $otherUser->id,
    ]);
});

test('can search recipes by name in planned meals index', function () {
    $recipe1 = \App\Models\Recipe::factory()->create([
        'user_id' => $this->user->id,
        'name' => 'Pasta Carbonara',
    ]);
    $recipe2 = \App\Models\Recipe::factory()->create([
        'user_id' => $this->user->id,
        'name' => 'Chicken Curry',
    ]);
    $recipe3 = \App\Models\Recipe::factory()->create([
        'user_id' => $this->user->id,
        'name' => 'Pasta Bolognese',
    ]);

    $response = $this->actingAs($this->user)->get(route('planned-meals.index', ['search' => 'Pasta']));

    $response->assertStatus(200);
    $response->assertInertia(function ($page) {
        $recipes = $page->toArray()['props']['recipes']['data'];
        $recipeNames = collect($recipes)->pluck('name');

        expect($recipeNames)->toContain('Pasta Carbonara', 'Pasta Bolognese');
        expect($recipeNames)->not->toContain('Chicken Curry');
    });
});

test('can filter recipes by tags in planned meals index', function () {
    $tag1 = \App\Models\Tag::factory()->create(['user_id' => $this->user->id, 'name' => 'Italian']);
    $tag2 = \App\Models\Tag::factory()->create(['user_id' => $this->user->id, 'name' => 'Spicy']);

    $recipe1 = \App\Models\Recipe::factory()->create([
        'user_id' => $this->user->id,
        'name' => 'Pasta',
    ]);
    $recipe1->tags()->attach($tag1->id);

    $recipe2 = \App\Models\Recipe::factory()->create([
        'user_id' => $this->user->id,
        'name' => 'Curry',
    ]);
    $recipe2->tags()->attach($tag2->id);

    $recipe3 = \App\Models\Recipe::factory()->create([
        'user_id' => $this->user->id,
        'name' => 'Pizza',
    ]);
    $recipe3->tags()->attach($tag1->id);

    $response = $this->actingAs($this->user)->get(route('planned-meals.index', ['tags' => [$tag1->id]]));

    $response->assertStatus(200);
    $response->assertInertia(function ($page) {
        $recipes = $page->toArray()['props']['recipes']['data'];
        $recipeNames = collect($recipes)->pluck('name');

        expect($recipeNames)->toContain('Pasta', 'Pizza');
        expect($recipeNames)->not->toContain('Curry');
    });
});

test('can filter recipes by meal times in planned meals index', function () {
    $breakfast = \App\Models\MealTime::where('name', 'breakfast')->first();
    $lunch = \App\Models\MealTime::where('name', 'lunch')->first();

    $recipe1 = \App\Models\Recipe::factory()->create([
        'user_id' => $this->user->id,
        'name' => 'Cereal',
    ]);
    $recipe1->mealTimes()->attach($breakfast->id);

    $recipe2 = \App\Models\Recipe::factory()->create([
        'user_id' => $this->user->id,
        'name' => 'Sandwich',
    ]);
    $recipe2->mealTimes()->attach($lunch->id);

    $response = $this->actingAs($this->user)->get(route('planned-meals.index', ['meal_times' => [$breakfast->id]]));

    $response->assertStatus(200);
    $response->assertInertia(function ($page) {
        $recipes = $page->toArray()['props']['recipes']['data'];
        $recipeNames = collect($recipes)->pluck('name');

        expect($recipeNames)->toContain('Cereal');
        expect($recipeNames)->not->toContain('Sandwich');
    });
});

test('can filter recipes by preparation time in planned meals index', function () {
    $quickRecipe = \App\Models\Recipe::factory()->create([
        'user_id' => $this->user->id,
        'name' => 'Quick Snack',
        'preparation_time' => 10,
    ]);

    $slowRecipe = \App\Models\Recipe::factory()->create([
        'user_id' => $this->user->id,
        'name' => 'Slow Cook',
        'preparation_time' => 45,
    ]);

    $response = $this->actingAs($this->user)->get(route('planned-meals.index', ['preparation_time' => '[0..15]']));

    $response->assertStatus(200);
    $response->assertInertia(function ($page) {
        $recipes = $page->toArray()['props']['recipes']['data'];
        $recipeNames = collect($recipes)->pluck('name');

        expect($recipeNames)->toContain('Quick Snack');
        expect($recipeNames)->not->toContain('Slow Cook');
    });
});

test('can filter recipes by cooking time in planned meals index', function () {
    $quickRecipe = \App\Models\Recipe::factory()->create([
        'user_id' => $this->user->id,
        'name' => 'Quick Cook',
        'cooking_time' => 5,
    ]);

    $longRecipe = \App\Models\Recipe::factory()->create([
        'user_id' => $this->user->id,
        'name' => 'Long Cook',
        'cooking_time' => 90,
    ]);

    $response = $this->actingAs($this->user)->get(route('planned-meals.index', ['cooking_time' => '>60']));

    $response->assertStatus(200);
    $response->assertInertia(function ($page) {
        $recipes = $page->toArray()['props']['recipes']['data'];
        $recipeNames = collect($recipes)->pluck('name');

        expect($recipeNames)->toContain('Long Cook');
        expect($recipeNames)->not->toContain('Quick Cook');
    });
});

test('can combine search and filters in planned meals index', function () {
    $tag = \App\Models\Tag::factory()->create(['user_id' => $this->user->id, 'name' => 'Italian']);

    $recipe1 = \App\Models\Recipe::factory()->create([
        'user_id' => $this->user->id,
        'name' => 'Pasta Carbonara',
        'preparation_time' => 10,
    ]);
    $recipe1->tags()->attach($tag->id);

    $recipe2 = \App\Models\Recipe::factory()->create([
        'user_id' => $this->user->id,
        'name' => 'Pasta Bolognese',
        'preparation_time' => 45,
    ]);
    $recipe2->tags()->attach($tag->id);

    $recipe3 = \App\Models\Recipe::factory()->create([
        'user_id' => $this->user->id,
        'name' => 'Quick Pasta',
        'preparation_time' => 10,
    ]);

    $response = $this->actingAs($this->user)->get(route('planned-meals.index', [
        'search' => 'Pasta',
        'tags' => [$tag->id],
        'preparation_time' => '[0..15]',
    ]));

    $response->assertStatus(200);
    $response->assertInertia(function ($page) {
        $recipes = $page->toArray()['props']['recipes']['data'];
        $recipeNames = collect($recipes)->pluck('name');

        expect($recipeNames)->toContain('Pasta Carbonara');
        expect($recipeNames)->not->toContain('Pasta Bolognese', 'Quick Pasta');
    });
});

test('returns no recipes when search has no matches', function () {
    $recipe = \App\Models\Recipe::factory()->create([
        'user_id' => $this->user->id,
        'name' => 'Pasta Carbonara',
    ]);

    $response = $this->actingAs($this->user)->get(route('planned-meals.index', ['search' => 'Sushi']));

    $response->assertStatus(200);
    $response->assertInertia(function ($page) {
        $recipes = $page->toArray()['props']['recipes']['data'];
        expect($recipes)->toBeEmpty();
    });
});

test('returns no recipes when filters have no matches', function () {
    $tag1 = \App\Models\Tag::factory()->create(['user_id' => $this->user->id, 'name' => 'Italian']);
    $tag2 = \App\Models\Tag::factory()->create(['user_id' => $this->user->id, 'name' => 'Asian']);

    $recipe = \App\Models\Recipe::factory()->create([
        'user_id' => $this->user->id,
        'name' => 'Pasta',
    ]);
    $recipe->tags()->attach($tag1->id);

    $response = $this->actingAs($this->user)->get(route('planned-meals.index', ['tags' => [$tag2->id]]));

    $response->assertStatus(200);
    $response->assertInertia(function ($page) {
        $recipes = $page->toArray()['props']['recipes']['data'];
        expect($recipes)->toBeEmpty();
    });
});
