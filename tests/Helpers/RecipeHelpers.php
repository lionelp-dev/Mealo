<?php

use App\Models\Recipe;

function createRecipeResource($userId = null, $withRelations = true, $attributes = [], $tagIds = [], $mealTimeIds = [])
{
    $recipeData = array_merge(['user_id' => $userId], $attributes);

    $recipe = Recipe::factory()->create($recipeData);

    // Attach custom tags if provided, otherwise use factory defaults
    if (! empty($tagIds)) {
        $recipe->tags()->attach($tagIds);
    } else {
        $recipe = Recipe::factory()
            ->withTags(5)
            ->create($recipeData);
    }

    // Attach custom meal times if provided, otherwise use factory defaults
    if (! empty($mealTimeIds)) {
        $recipe->mealTimes()->attach($mealTimeIds);
    } elseif (empty($tagIds)) { // Only if we haven't recreated the recipe
        $recipe = Recipe::factory()
            ->withMealTime(2)
            ->withIngredients(10)
            ->withSteps(10)
            ->withTags(5)
            ->create($recipeData);
    }

    // Add default relations if no custom ones were specified
    if (empty($tagIds) && empty($mealTimeIds)) {
        // Recipe already created with relations above
    } else {
        // Add missing default relations
        if ($recipe->ingredients()->count() == 0) {
            $recipe = Recipe::factory()->withIngredients(10)->create($recipeData);
        }
        if ($recipe->steps()->count() == 0) {
            $recipe = Recipe::factory()->withSteps(10)->create($recipeData);
        }
    }

    if ($withRelations) {
        $recipe->load(['mealTimes', 'ingredients', 'steps', 'tags']);
    }

    return $recipe;
}

function createRecipeWithCustomData($userId, $attributes = [], $tagIds = [], $mealTimeIds = [])
{
    $recipe = Recipe::factory()->create(array_merge(['user_id' => $userId], $attributes));

    if (! empty($tagIds)) {
        $recipe->tags()->attach($tagIds);
    }

    if (! empty($mealTimeIds)) {
        $recipe->mealTimes()->attach($mealTimeIds);
    }

    $recipe->load(['mealTimes', 'ingredients', 'steps', 'tags']);

    return $recipe;
}

function makeRecipeResource()
{
    return Recipe::factory()
        ->withMealTime(2)
        ->withIngredients(10)
        ->withSteps(10)
        ->withTags(5)
        ->make();
}

function buildRecipeUpdateData(Recipe $recipe, array $overrides = []): array
{
    return array_merge([
        'name' => $recipe->name,
        'description' => $recipe->description,
        'serving_size' => $recipe->serving_size ?? 4,
        'preparation_time' => $recipe->preparation_time ?? 30,
        'cooking_time' => $recipe->cooking_time ?? 45,
        'meal_times' => [['name' => 'diner']],
        'ingredients' => [['name' => 'Tomato', 'quantity' => 2, 'unit' => 'pieces']],
        'steps' => [['order' => 1, 'description' => 'Wash tomatoes']],
        'tags' => [['name' => 'healthy']],
    ], $overrides);
}
