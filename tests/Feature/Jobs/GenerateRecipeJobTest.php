<?php

use App\Actions\Recipes\RecipeAIGenerationAction;
use App\Actions\Recipes\RecipeStoreAction;
use App\Jobs\GenerateRecipeJob;
use App\Models\User;

test('recipe generation job is released when openrouter api key is missing', function () {
    config()->set('services.openai.api_key', null);
    config()->set('recipe-queue.missing_api_key_release_delay', 300);

    $user = User::factory()->create();
    $job = (new GenerateRecipeJob($user->id, 'Plat dessert pour petit-dejeuner', 13))
        ->withFakeQueueInteractions();

    $recipeAIGenerationAction = Mockery::mock(RecipeAIGenerationAction::class);
    $recipeAIGenerationAction->shouldNotReceive('execute');

    $recipeStoreAction = Mockery::mock(RecipeStoreAction::class);
    $recipeStoreAction->shouldNotReceive('execute');

    $job->handle($recipeAIGenerationAction, $recipeStoreAction);

    $job->assertReleased(300);
    $job->assertNotFailed();
});

test('recipe generation job treats example openrouter api key as missing', function () {
    config()->set('services.openai.api_key', 'sk-or-v1-fake-key-for-testing');
    config()->set('recipe-queue.missing_api_key_release_delay', 300);

    $user = User::factory()->create();
    $job = (new GenerateRecipeJob($user->id, 'Plat dessert pour petit-dejeuner', 13))
        ->withFakeQueueInteractions();

    $recipeAIGenerationAction = Mockery::mock(RecipeAIGenerationAction::class);
    $recipeAIGenerationAction->shouldNotReceive('execute');

    $recipeStoreAction = Mockery::mock(RecipeStoreAction::class);
    $recipeStoreAction->shouldNotReceive('execute');

    $job->handle($recipeAIGenerationAction, $recipeStoreAction);

    $job->assertReleased(300);
    $job->assertNotFailed();
});

test('recipe generation job still throws real ai errors when api key is configured', function () {
    config()->set('services.openai.api_key', 'sk-or-v1-real-key');

    $user = User::factory()->create();
    $job = (new GenerateRecipeJob($user->id, 'Plat dessert pour petit-dejeuner', 13))
        ->withFakeQueueInteractions();

    $recipeAIGenerationAction = Mockery::mock(RecipeAIGenerationAction::class);
    $recipeAIGenerationAction
        ->shouldReceive('execute')
        ->once()
        ->andThrow(new Exception('OpenRouter unavailable'));

    $recipeStoreAction = Mockery::mock(RecipeStoreAction::class);
    $recipeStoreAction->shouldNotReceive('execute');

    $job->handle($recipeAIGenerationAction, $recipeStoreAction);
})->throws(Exception::class, 'OpenRouter unavailable');
