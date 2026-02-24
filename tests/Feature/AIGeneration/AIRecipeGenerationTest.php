<?php

namespace Tests\Feature\AIRecipeGeneration;

use App\Http\Requests\GenerateRecipeRequest;
use App\Http\Requests\StoreRecipeRequest;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->otherUser = User::factory()->create();

    $this->generateRecipeRequestRules = (new GenerateRecipeRequest)->rules();
    $this->storeRecipeRequestRules = (new StoreRecipeRequest)->rules();
});

function assertValidData(array $data, array $rules): void
{
    $validator = Validator::make($data, $rules);
    expect($validator->fails())->toBeFalse();
}

test('recipe generation screen can be rendered', function () {
    $response = $this->actingAs($this->user)->get(route('recipes.create', ['generate' => true]));
    $response->assertStatus(200);
});

test('user can generate a recipe successfully with simple prompt', function () {
    $promptData = ['prompt' => 'une recette simple avec du saumon grillé'];

    $response = $this->actingAs($this->user)->post(route('recipes.generate'), $promptData);

    $response->assertStatus(200);
    $response->assertInertia(
        fn ($page) => $page
            ->component('recipe/create')
            ->has('generated_recipe')
            ->has('generated_recipe.name')
            ->has('generated_recipe.description')
            ->has('generated_recipe.preparation_time')
            ->has('generated_recipe.cooking_time')
            ->has('generated_recipe.meal_times')
            ->has('generated_recipe.tags')
            ->has('generated_recipe.ingredients')
            ->has('generated_recipe.steps')
    );

    $data = $response->getOriginalContent()->getData()['page']['props'];
    $generatedRecipe = $data['generated_recipe'];

    assertValidData($generatedRecipe, $this->storeRecipeRequestRules);
});

test('user cannot generate recipe with invalid prompt', function () {
    $invalidData = [
        'prompt' => '',
    ];

    $response = $this->actingAs($this->user)->post(route('recipes.generate'), $invalidData);

    $response->assertStatus(302);
    $response->assertSessionHasErrors(['prompt']);
});

test('guest user cannot access recipe generation', function () {
    $response = $this->get(route('recipes.create', ['generate' => true]));
    $response->assertRedirect(route('login'));
});

test('guest user cannot generate recipe', function () {
    $promptData = [
        'prompt' => 'une recette avec du saumon',
    ];

    $response = $this->post(route('recipes.generate'), $promptData);
    $response->assertRedirect(route('login'));
});

test('handles openai api failure gracefully', function () {
    $mockClient = \Mockery::mock();
    $mockChat = \Mockery::mock();
    $mockChat->shouldReceive('create')->andThrow(new \Exception('OpenAI API error'));
    $mockClient->shouldReceive('chat')->andReturn($mockChat);

    app()->instance('openai.client', $mockClient);

    $promptData = [
        'prompt' => 'une simple recette végétarienne',
    ];

    $response = $this->actingAs($this->user)->post(route('recipes.generate'), $promptData);

    $response->assertStatus(302);
    $response->assertRedirect(route('recipes.create'));
    $response->assertSessionHas('error', 'Failed to generate recipe: OpenAI API error');
});
