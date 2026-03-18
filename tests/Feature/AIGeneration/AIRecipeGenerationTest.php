<?php

namespace Tests\Feature\AIRecipeGeneration;

use App\Models\User;
use Tests\Helpers\OpenAITestHelper;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->otherUser = User::factory()->create();
});

test('recipe generation screen can be rendered', function () {
    $response = $this->actingAs($this->user)->get(route('recipes.create', ['generate' => true]));
    $response->assertStatus(200);
});

test('user can generate a recipe successfully with simple prompt', function () {
    // Mock the OpenAI response
    OpenAITestHelper::mockSuccessfulRecipeGeneration([
        'name' => 'Saumon Grillé au Citron',
        'description' => 'Un délicieux saumon grillé avec une touche de citron',
        'preparation_time' => 15,
        'cooking_time' => 20,
        'serving_size' => 2,
        'meal_times' => [['id' => 2, 'name' => 'lunch']],
        'tags' => [['name' => 'healthy'], ['name' => 'seafood']],
        'ingredients' => [
            ['name' => 'Filet de saumon', 'quantity' => 500, 'unit' => 'g'],
            ['name' => 'Citron', 'quantity' => 1, 'unit' => 'pièce'],
        ],
        'steps' => [
            ['description' => 'Préchauffer le grill', 'order' => 1],
            ['description' => 'Griller le saumon 10 min de chaque côté', 'order' => 2],
        ],
    ]);

    $response = $this->actingAs($this->user)->post(route('recipes.generate'), [
        'prompt' => 'une recette simple avec du saumon grillé',
    ]);

    // Should return 200 with Inertia component
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

    // Verify the generated recipe data is valid (structure check)
    $data = $response->getOriginalContent()->getData()['page']['props'];
    $generatedRecipe = $data['generated_recipe'];

    // Basic validation - ensure key fields exist
    expect($generatedRecipe)->toHaveKeys(['name', 'description', 'preparation_time', 'cooking_time', 'meal_times', 'tags', 'ingredients', 'steps']);
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
    OpenAITestHelper::mockOpenAIErrorException('OpenAI API error');

    $promptData = [
        'prompt' => 'une simple recette végétarienne',
    ];

    $response = $this->actingAs($this->user)->post(route('recipes.generate'), $promptData);

    $response->assertStatus(302);
    $response->assertRedirect(route('recipes.create'));
    $response->assertSessionHas('error', 'Failed to generate recipe: OpenAI API error');
});

test('handles openai rate limit gracefully', function () {
    OpenAITestHelper::mockOpenAIRateLimit();

    $promptData = [
        'prompt' => 'une recette végétarienne',
    ];

    $response = $this->actingAs($this->user)->post(route('recipes.generate'), $promptData);

    $response->assertStatus(302);
    $response->assertRedirect(route('recipes.create'));
    $response->assertSessionHas('error');
});

test('handles openai invalid api key gracefully', function () {
    OpenAITestHelper::mockOpenAIInvalidApiKey();

    $promptData = [
        'prompt' => 'une recette avec des herbes',
    ];

    $response = $this->actingAs($this->user)->post(route('recipes.generate'), $promptData);

    $response->assertStatus(302);
    $response->assertRedirect(route('recipes.create'));
    $response->assertSessionHas('error');
});
