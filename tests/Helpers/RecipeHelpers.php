<?php

use App\Http\Resources\RecipeResource;
use App\Models\Recipe;

function createRecipeResource($userId = null, $withRelations = true)
{
    $recipe = Recipe::factory()
        ->withMealTime(2)
        ->withIngredients(10)
        ->withSteps(10)
        ->withTags(5)
        ->create(['user_id' => $userId]);

    if ($withRelations) {
        $recipe->load(['mealTimes', 'ingredients', 'steps', 'tags']);
    }

    return new RecipeResource($recipe);
}

function makeRecipeResource()
{
    return new RecipeResource(Recipe::factory()
        ->withMealTime(2)
        ->withIngredients(10)
        ->withSteps(10)
        ->withTags(5)
        ->make());
}