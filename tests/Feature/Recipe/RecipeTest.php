<?php

namespace Tests\Feature\Recipe;

use App\Http\Resources\RecipeResource;
use App\Models\Recipe;
use Database\Seeders\MealTimeSeeder;


test('recipes screen can be rendered', function () {
    $user = \App\Models\User::factory()->create();
    $response = $this->actingAs($user)->get(route('recipes.index'));
    $response->assertStatus(200);
});


test('create recipe screen can be rendered', function () {
    $user = \App\Models\User::factory()->create();
    $response = $this->actingAs($user)->get(route('recipes.create'));
    $response->assertStatus(200);
});

test('user can create a recipe successfully', function () {
    $user = \App\Models\User::factory()->create();

    $this->seed(MealTimeSeeder::class);

    $recipe = new RecipeResource(Recipe::factory()
        ->withMealTime(2)
        ->withIngredients(10)
        ->withSteps(10)
        ->withTags(5)
        ->make())->toArray(request());

    $response = $this->actingAs($user)->post(route('recipes.store'), $recipe);

    $response->assertStatus(302);
    $response->assertRedirect(route('recipes.index'));
    $response->assertSessionHas('success', 'Recipe successfully created');
});
