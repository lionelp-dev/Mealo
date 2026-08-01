<?php

namespace Tests\Feature\Recipe;

beforeEach(function () {
    /** @var \Tests\TestCase $this */
    $this->setUpRecipeContext();
    $this->setUpOtherUserRecipeContext();
});

describe('RecipeDestroy', function () {
    describe('forbidden messages', function () {
        test('when user is unauthorized', function () {
            /** @var \Tests\TestCase $this */
            $response = $this->actingAs($this->user)
                ->delete(route('recipes.destroy'), ['ids' => [$this->otherUserRecipe->id]])
                ->assertRedirect()
                ->assertSessionHas('error', 'Recipe unsuccessfully deleted');
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
                ->assertSessionHas('success', 'Recipe successfully deleted');
        });
    });
});
