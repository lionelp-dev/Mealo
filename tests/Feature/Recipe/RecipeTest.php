<?php

namespace Tests\Feature\Recipe;

beforeEach(function () {
    /** @var \Tests\TestCase $this */
    $this->createUserContext();
    $this->createRecipeContext();
});

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------
test('recipes screen can be rendered', function () {
    /** @var \Tests\TestCase $this */
    $this->actingAs($this->user)
        ->get(route('recipes.index'))
        ->assertOk();
});

test('create recipe screen can be rendered', function () {
    /** @var \Tests\TestCase $this */
    $this->actingAs($this->user)
        ->get(route('recipes.create'))
        ->assertOk();
});

test('show recipe screen can be rendered', function () {
    /** @var \Tests\TestCase $this */
    $this->actingAs($this->user)
        ->get(route('recipes.show', $this->recipe))
        ->assertOk();
});

test('edit recipe screen can be rendered', function () {
    /** @var \Tests\TestCase $this */
    $this->actingAs($this->user)
        ->get(route('recipes.edit', $this->recipe))
        ->assertOk();
});

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------
test('user can create a recipe successfully', function () {
    /** @var \Tests\TestCase $this */
    $response = $this->actingAs($this->user)
        ->post(route('recipes.store'), $this->storeRecipeRequestData->transform());

    $response->assertRedirect($uri = $response->headers->get('Location'));
    $response->assertSessionHas('success', 'Recipe successfully created');
});

test('user cannot create recipe with invalid data', function () {
    /** @var \Tests\TestCase $this */
    $this->actingAs($this->user)
        ->post(route('recipes.store'), [
            'name' => '',
            'description' => '',
            'preparation_time' => -1,
            'cooking_time' => -1,
            'serving_size' => -1,
        ])
        ->assertRedirect()
        ->assertSessionHasErrors(['name', 'preparation_time', 'cooking_time', 'serving_size']);
});

// ---------------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------------
test('user can update a recipe successfully', function () {
    /** @var \Tests\TestCase $this */
    $this->actingAs($this->user)
        ->put(route('recipes.update', $this->recipe), $this->updateRecipeRequestData->transform())
        ->assertRedirect(route('recipes.show', $this->recipe))
        ->assertSessionHas('success', 'Recipe successfully updated');
});

test('user cannot update recipe with invalid data', function () {
    /** @var \Tests\TestCase $this */
    $this->actingAs($this->user)
        ->put(route('recipes.update', $this->recipe), [
            'name' => '',
            'description' => '',
            'preparation_time' => -1,
            'cooking_time' => -1,
            'serving_size' => -1,
        ])
        ->assertRedirect()
        ->assertSessionHasErrors(['name', 'preparation_time', 'cooking_time', 'serving_size']);

});

test('user cannot update other users recipe', function () {
    /** @var \Tests\TestCase $this */
    $this->actingAs($this->user)
        ->put(route('recipes.update', $this->otherUserRecipe), $this->updateRecipeRequestData->transform())
        ->assertForbidden();
});

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------
test('user can delete a recipe successfully', function () {
    /** @var \Tests\TestCase $this */
    $this->actingAs($this->user)
        ->delete(route('recipes.destroy'), ['ids' => [$this->recipe->id]])
        ->assertRedirect(route('recipes.index'))
        ->assertSessionHas('success', 'Recipe successfully deleted');
});

// ---------------------------------------------------------------------------
// Guests
// ---------------------------------------------------------------------------
test('guest cannot access recipe routes', function () {
    /** @var \Tests\TestCase $this */
    $this->get(route('recipes.index'))->assertRedirect(route('login'));
    $this->get(route('recipes.create'))->assertRedirect(route('login'));
    $this->get(route('recipes.show', $this->recipe))->assertRedirect(route('login'));
    $this->get(route('recipes.edit', $this->recipe))->assertRedirect(route('login'));
    $this->post(route('recipes.store'), $this->storeRecipeRequestData->transform())->assertRedirect(route('login'));
    $this->put(route('recipes.update', $this->recipe), $this->updateRecipeRequestData->transform())->assertRedirect(route('login'));
    $this->delete(route('recipes.destroy', $this->recipe))->assertRedirect(route('login'));
});

// ---------------------------------------------------------------------------
// Access control
// ---------------------------------------------------------------------------
test('user cannot access other users recipes', function () {
    /** @var \Tests\TestCase $this */
    $this->actingAs($this->user)
        ->get(route('recipes.show', $this->otherUserRecipe))
        ->assertForbidden();

    $this->actingAs($this->user)
        ->get(route('recipes.edit', $this->otherUserRecipe))
        ->assertForbidden();

    $this->actingAs($this->user)
        ->delete(route('recipes.destroy'), ['ids' => [$this->otherUserRecipe->id]])
        ->assertRedirect();
});
