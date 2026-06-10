<?php

namespace Tests\Feature\Recipe;

use App\Actions\PlannedMeal\PlannedMealStoreAction;

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

test('user cannot access other users recipes', function () {
    /** @var \Tests\TestCase $this */
    $this->actingAs($this->user)
        ->get(route('recipes.show', $this->otherUserRecipe))
        ->assertForbidden();

    $this->actingAs($this->user)
        ->get(route('recipes.edit', $this->otherUserRecipe))
        ->assertForbidden();
});

test('workspace members can view planned recipes from other members', function () {
    /** @var \Tests\TestCase $this */
    app(PlannedMealStoreAction::class)
        ->execute(
            $this->user,
            $this->sharedWorkspace,
            $this->userPlannedMealStoreRequestData
        );

    $response = $this->actingAs($this->editorUser)
        ->withSession(['current_workspace_id' => $this->sharedWorkspace->id])
        ->get(route('recipes.show', ['recipe' => $this->recipe->id]));

    $response->assertStatus(200);

    $response = $this->actingAs($this->viewerUser)
        ->withSession(['current_workspace_id' => $this->sharedWorkspace->id])
        ->get(route('recipes.show', ['recipe' => $this->recipe->id]));

    $response->assertStatus(200);
});

test('guest cannot access recipe routes', function () {
    /** @var \Tests\TestCase $this */
    $this->get(route('recipes.index'))->assertRedirect(route('login'));
    $this->get(route('recipes.create'))->assertRedirect(route('login'));
    $this->get(route('recipes.show', $this->recipe))->assertRedirect(route('login'));
    $this->get(route('recipes.edit', $this->recipe))->assertRedirect(route('login'));
    $this->post(route('recipes.store'), $this->recipeStoreRequestData->transform())->assertRedirect(route('login'));
    $this->put(route('recipes.update', $this->recipe), $this->recipeUpdateRequestData->transform())->assertRedirect(route('login'));
    $this->delete(route('recipes.destroy', $this->recipe))->assertRedirect(route('login'));
});
