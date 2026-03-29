<?php

namespace Tests;

use App\Http\Resources\RecipeResource;
use App\Models\Recipe;
use App\Models\User;
use App\Models\Workspace;

/*

|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| Reference data (roles, permissions, meal times) is seeded before every
| Feature test so individual test files do not need to call seed() for
| these static lookup tables.
|
*/

pest()->extend(TestCase::class)
    ->in('Unit');

pest()->extend(TestCase::class)
    ->in('Integration');

pest()->extend(TestCase::class)
    ->in('Feature');

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
|
| Global helpers auto-loaded by Pest across all test files.
| No need for `require_once` in individual test files.
|
*/

/**
 * Create a user with a personal workspace.
 */
function createUserWithWorkspace(array $attributes = []): User
{
    $user = User::factory()->create($attributes);
    Workspace::createPersonalWorkspace($user);

    return $user;
}

/**
 * Create a fully-loaded recipe (meal times, ingredients, steps, tags)
 * owned by the given user and return it as a RecipeResource.
 *
 * Use this when you need a valid payload to POST/PUT to the API.
 */
function recipeResourceFor(User $user, array $attributes = []): RecipeResource
{
    $recipe = Recipe::factory()
        ->withMealTime(2)
        ->withIngredients(10)
        ->withSteps(10)
        ->withTags(5)
        ->create(array_merge(['user_id' => $user->id], $attributes));

    $recipe->load(['mealTimes', 'ingredients', 'steps', 'tags']);

    return new RecipeResource($recipe);
}

/**
 * Create a minimal recipe (no relations) owned by the given user.
 *
 * Use this when you only need the recipe to exist in the DB (e.g. for
 * delete / access-control tests) and don't need a full resource payload.
 */
function createRecipeFor(User $user, array $attributes = []): Recipe
{
    return Recipe::factory()->create(
        array_merge(['user_id' => $user->id], $attributes)
    );
}
