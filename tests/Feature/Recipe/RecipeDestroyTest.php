<?php

namespace Tests\Feature\Recipe;

use App\Exceptions\Recipe\RecipeDeleteAuthorizationException;
use App\Messages\Recipe\RecipeDeletedMessage;
use Illuminate\Support\Facades\Gate;

beforeEach(function () {
    /** @var \Tests\TestCase $this */
    $this->setUpRecipeContext();
    $this->setUpOtherUserRecipeContext();
});

describe('RecipeDestroy', function () {
    describe('authorization', function () {
        test('only the recipe owner can delete recipes', function () {
            /** @var \Tests\TestCase $this */
            expect(Gate::forUser($this->user)->allows('delete', $this->recipe))->toBeTrue()
                ->and(Gate::forUser($this->user)->allows('delete', $this->otherUserRecipe))->toBeFalse();
        });
    });

    describe('forbidden messages', function () {
        test('when user is unauthorized', function () {
            /** @var \Tests\TestCase $this */
            $response = $this->actingAs($this->user)
                ->delete(route('recipes.destroy'), ['ids' => [$this->otherUserRecipe->id]])
                ->assertRedirect()
                ->assertSessionHas('error', RecipeDeleteAuthorizationException::message());
        });
    });

    describe('validation errors', function () {
        test('when data is invalid', function () {
            /** @var \Tests\TestCase $this */
            $response = $this->actingAs($this->user)
                ->delete(route('recipes.destroy'), ['ids' => [99999999]])
                ->assertInvalid()
                ->assertRedirect();
        });
    });

    describe('success messages', function () {
        test('when successfully delete a recipe', function () {
            /** @var \Tests\TestCase $this */
            $this->actingAs($this->user)
                ->delete(route('recipes.destroy'), ['ids' => [$this->recipe->id]])
                ->assertRedirect(route('recipes.index'))
                ->assertSessionHas('success', RecipeDeletedMessage::message());
        });
    });
});
