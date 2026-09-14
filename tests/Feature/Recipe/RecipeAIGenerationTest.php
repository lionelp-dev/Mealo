<?php

namespace Tests\Feature\Recipe;

use App\Actions\Recipes\RecipeAIGenerationAction;
use App\Data\Requests\Recipe\RecipeAIGeneratedStoreRequestData;
use App\Jobs\RecipeAIGenerationJob;
use App\Messages\Recipe\RecipePrefilledMessage;
use App\Models\IngredientCategory;
use App\Models\MealTime;
use Illuminate\Support\Facades\Queue;
use Inertia\Testing\AssertableInertia as Assert;

describe('RecipeAIGenerationTest', function () {
    beforeEach(fn () => Queue::fake());

    test('generates a recipe preview without queueing or generating an image', function () {
        /** @var \Tests\TestCase $this */
        $mealTime = MealTime::query()->orderBy('id')->firstOrFail();
        $category = IngredientCategory::query()->orderBy('id')->firstOrFail();
        $generatedRecipe = RecipeAIGeneratedStoreRequestData::validateAndCreate([
            'name' => 'Poulet citron romarin',
            'description' => 'Un plat familial au four.',
            'serving_size' => 4,
            'preparation_time' => 15,
            'cooking_time' => 45,
            'meal_times' => [
                ['id' => $mealTime->id, 'slug' => $mealTime->slug],
            ],
            'ingredients' => [
                [
                    'name' => 'Poulet',
                    'quantity' => 1,
                    'unit' => 'piece',
                    'category_id' => $category->id,
                ],
            ],
            'steps' => [
                ['order' => 1, 'description' => 'Cuire au four.'],
            ],
            'tags' => [
                ['name' => 'four'],
            ],
            'image' => null,
            'image_data_url' => 'data:image/png;base64,ignored',
        ]);

        $this->mock(RecipeAIGenerationAction::class)
            ->shouldReceive('execute')
            ->once()
            ->withArgs(fn ($requestData, bool $generateImages): bool => $generateImages === false
                && $requestData->prompt === 'Poulet citron romarin pour quatre personnes'
                && $requestData->context['count'] === 1
                && $requestData->context['meal_time'] === null
            )
            ->andReturn([$generatedRecipe]);

        $this->actingAs($this->user)
            ->post(route('recipes.ai-generation-preview'), [
                'prompt' => 'Poulet citron romarin pour quatre personnes',
                'context' => [
                    'meal_time' => null,
                    'meal_times' => [],
                    'count' => 1,
                ],
                'image_generation' => false,
            ])
            ->assertInertia(fn (Assert $page) => $page
                ->component('recipe/create')
                ->where('generated_recipe.name', 'Poulet citron romarin')
                ->where('generated_recipe.image_data_url', 'data:image/png;base64,ignored')
                ->where('flash.success', RecipePrefilledMessage::message())
            );

        Queue::assertNothingPushed();
    });

    test('queues one generation job per selected meal time with distributed counts', function () {
        /** @var \Tests\TestCase $this */
        $mealTimes = MealTime::query()->orderBy('id')->take(2)->pluck('slug')->all();

        $this->actingAs($this->user)
            ->post(route('recipes.ai-generation'), [
                'prompt' => 'Des repas végétariens rapides pour la semaine',
                'context' => [
                    'meal_times' => $mealTimes,
                    'count' => 5,
                ],
                'image_generation' => true,
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect();

        Queue::assertPushed(
            RecipeAIGenerationJob::class,
            fn (RecipeAIGenerationJob $job): bool => $job->userId === $this->user->id
                && $job->recipeAIGenerationRequestData->aiPayload()['context']['meal_time'] === $mealTimes[0]
                && $job->recipeAIGenerationRequestData->aiPayload()['context']['count'] === 3
                && ! array_key_exists('meal_times', $job->recipeAIGenerationRequestData->aiPayload()['context'])
        );

        Queue::assertPushed(
            RecipeAIGenerationJob::class,
            fn (RecipeAIGenerationJob $job): bool => $job->userId === $this->user->id
                && $job->recipeAIGenerationRequestData->aiPayload()['context']['meal_time'] === $mealTimes[1]
                && $job->recipeAIGenerationRequestData->aiPayload()['context']['count'] === 2
                && ! array_key_exists('meal_times', $job->recipeAIGenerationRequestData->aiPayload()['context'])
        );

        Queue::assertPushed(RecipeAIGenerationJob::class, 2);
    });

    test('queues a single generation job for legacy meal time context', function () {
        /** @var \Tests\TestCase $this */
        $mealTime = MealTime::query()->orderBy('id')->value('slug');

        $this->actingAs($this->user)
            ->post(route('recipes.ai-generation'), [
                'context' => [
                    'meal_time' => $mealTime,
                    'meal_times' => [],
                    'count' => 1,
                ],
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect();

        Queue::assertPushed(
            RecipeAIGenerationJob::class,
            fn (RecipeAIGenerationJob $job): bool => $job->recipeAIGenerationRequestData
                ->aiPayload()['context']['meal_time'] === $mealTime
                && $job->recipeAIGenerationRequestData->aiPayload()['context']['count'] === 1
                && ! array_key_exists('meal_times', $job->recipeAIGenerationRequestData->aiPayload()['context'])
        );

        Queue::assertPushed(RecipeAIGenerationJob::class, 1);
    });

    test('queues a single generation job without a meal time when none is selected', function () {
        /** @var \Tests\TestCase $this */
        $this->actingAs($this->user)
            ->post(route('recipes.ai-generation'), [
                'context' => [
                    'count' => 2,
                ],
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect();

        Queue::assertPushed(
            RecipeAIGenerationJob::class,
            fn (RecipeAIGenerationJob $job): bool => $job->recipeAIGenerationRequestData
                ->aiPayload()['context']['meal_time'] === null
                && $job->recipeAIGenerationRequestData->aiPayload()['context']['count'] === 2
        );

        Queue::assertPushed(RecipeAIGenerationJob::class, 1);
    });

    test('requires meal times context to be an array when provided', function () {
        /** @var \Tests\TestCase $this */
        $this->actingAs($this->user)
            ->post(route('recipes.ai-generation'), [
                'context' => [
                    'meal_times' => 'breakfast',
                    'count' => 3,
                ],
            ])
            ->assertSessionHasErrors(['context.meal_times']);

        Queue::assertNothingPushed();
    });

    test('rejects unknown meal time slugs without dispatching', function () {
        /** @var \Tests\TestCase $this */
        $this->actingAs($this->user)
            ->post(route('recipes.ai-generation'), [
                'context' => [
                    'meal_times' => ['not-a-meal-time'],
                    'count' => 1,
                ],
            ])
            ->assertSessionHasErrors(['context.meal_times']);

        Queue::assertNothingPushed();
    });

    test('rejects a count below the number of selected meal times without dispatching', function () {
        /** @var \Tests\TestCase $this */
        $mealTimes = MealTime::query()->orderBy('id')->take(2)->pluck('slug')->all();

        $this->actingAs($this->user)
            ->post(route('recipes.ai-generation'), [
                'context' => [
                    'meal_times' => $mealTimes,
                    'count' => 1,
                ],
            ])
            ->assertSessionHasErrors(['context.count']);

        Queue::assertNothingPushed();
    });
});
