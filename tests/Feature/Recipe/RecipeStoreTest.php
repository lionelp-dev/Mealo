<?php


describe('RecipeStoreTest', function () {

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
                 ->assertSessionHas('success', 'Recipe successfully created');
        });
    });
});
