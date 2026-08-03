<?php

namespace Tests\Feature\Recipe;

use App\Exceptions\Recipe\RecipeUpdateAuthorizationException;
use App\Messages\Recipe\RecipeUpdatedMessage;
use Illuminate\Support\Facades\Gate;

beforeEach(function () {
    /** @var \Tests\TestCase $this */
    $this->setUpRecipeContext();
    $this->setUpOtherUserRecipeContext();
});

describe('RecipeUpdate', function () {
    describe('authorization', function () {
        test('only the recipe owner can update recipes', function () {
            /** @var \Tests\TestCase $this */
            expect(Gate::forUser($this->user)->allows('update', $this->recipe))->toBeTrue()
                ->and(Gate::forUser($this->user)->allows('update', $this->otherUserRecipe))->toBeFalse();
        });
    });

    describe('forbidden messages', function () {
        test('when user is unauthorized', function () {
            /** @var \Tests\TestCase $this */
            $this->actingAs($this->user)
                ->put(
                    route('recipes.update', $this->otherUserRecipe),
                    [
                        'id' => $this->otherUserRecipe->id,
                        'name' => 'any_new_name',
                        ...$this->recipeStoreRequestData->transform(),
                    ]
                )
                ->assertRedirect()
                ->assertSessionHas('error', RecipeUpdateAuthorizationException::message());
        });
    });

    describe('validation errors', function () {
        test('when data is invalid', function () {
            /** @var \Tests\TestCase $this */
            $this->actingAs($this->user)
                ->put(
                    route('recipes.update', $this->recipe),
                    [
                        ...$this->recipeStoreRequestData->transform(),
                        'id' => $this->recipe->id,
                        'name' => '',
                        'description' => '',
                        'serving_size' => 0,
                    ]
                )
                ->assertRedirect()
                ->assertSessionHasErrors(['name', 'description', 'serving_size']);
        });
    });

    describe('success messages', function () {
        test('when update data is valid', function () {
            /** @var \Tests\TestCase $this */
            $this->actingAs($this->user)
                ->put(
                    route('recipes.update', $this->recipe),
                    [
                        ...$this->recipeStoreRequestData->transform(),
                        'id' => $this->recipe->id,
                        'name' => 'any_new_name',
                    ]
                )
                ->assertRedirect()
                ->assertSessionHas('success', RecipeUpdatedMessage::message());
        });
    });
});
