<?php

namespace Tests\Feature\Recipe;

use App\Messages\Recipe\RecipeCreatedMessage;
use App\Models\Recipe;
use Illuminate\Support\Facades\Gate;

describe('RecipeStoreTest', function () {

    describe('authorization', function () {
        test('only authenticated users can create recipes', function () {
            /** @var \Tests\TestCase $this */
            expect(Gate::forUser(null)->allows('create', Recipe::class))->toBeFalse()
                ->and(Gate::forUser($this->user)->allows('create', Recipe::class))->toBeTrue();
        });

    });

    describe('validation errors', function () {
        test('when recipe is invalid', function () {
            /** @var \Tests\TestCase $this */
            $this->actingAs($this->user)
                ->post(route('recipes.store'), [
                    'name' => '',
                    'description' => '',
                    'preparation_time' => -1,
                    'cooking_time' => -1,
                    'serving_size' => -1,
                ])
                ->assertSessionHasErrors([
                    'name',
                    'description',
                    'preparation_time',
                    'cooking_time',
                    'serving_size',
                ]);
        });
    });

    describe('success messages', function () {
        test('when a recipe successfully created', function () {
            /** @var \Tests\TestCase $this */
            $this->actingAs($this->user)
                ->post(route('recipes.store'), $this->recipeStoreRequestData->transform())
                ->assertSessionHas('success', RecipeCreatedMessage::message());
        });
    });
});
