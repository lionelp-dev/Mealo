<?php

namespace Tests\Feature\Recipe;

describe('RecipeUpdate', function () {
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
                 ->assertSessionHas('error', 'Recipe unsuccessfully updated');
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
                 ->assertSessionHasErrors(['name','description','serving_size']);
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
                 ->assertSessionHas('success', 'Recipe successfully updated');
        });
    });
});
