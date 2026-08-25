<?php

namespace Tests\Feature\Recipe;

use App\Actions\PlannedMeal\PlannedMealStoreAction;
use App\Exceptions\Recipe\RecipeUpdateAuthorizationException;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    /** @var \Tests\TestCase $this */
    $this->setUpRecipeContext();
    $this->setUpOtherUserRecipeContext();
    $this->setUpSharedWorkspaceContext();
    $this->setUpUserPlannedMealStoreRequestDataContext();
    $this->setUpRecipeUpdateRequestDataContext();
});

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
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('recipe/create')
            ->has('ingredient_categories')
        );
});

test('recipe detail panel data can be rendered on recipes screen', function () {
    /** @var \Tests\TestCase $this */
    $ingredientsCount = $this->recipe->ingredients()->count();

    $this->actingAs($this->user)
        ->get(route('recipes.index', ['recipe' => $this->recipe->id]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('recipe/index')
            ->where('selected_recipe.id', $this->recipe->id)
            ->has('selected_recipe.ingredients', $ingredientsCount)
            ->has('recipes.data.0.ingredients')
        );
});

test('edit recipe screen can be rendered', function () {
    /** @var \Tests\TestCase $this */
    $this->actingAs($this->user)
        ->get(route('recipes.edit', $this->recipe))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('recipe/edit')
            ->has('ingredient_categories')
        );
});

test('user cannot access other users recipes', function () {
    /** @var \Tests\TestCase $this */
    $this->actingAs($this->user)
        ->get(route('recipes.index', ['recipe' => $this->otherUserRecipe->id]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('recipe/index')
            ->where('selected_recipe', null)
        );

    $this->actingAs($this->user)
        ->get(route('recipes.edit', $this->otherUserRecipe))
        ->assertRedirect()
        ->assertSessionHas('error', RecipeUpdateAuthorizationException::message());
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
        ->get(route('recipes.index', ['recipe' => $this->recipe->id]));

    $response
        ->assertStatus(200)
        ->assertInertia(fn (Assert $page) => $page
            ->component('recipe/index')
            ->where('selected_recipe.id', $this->recipe->id)
        );

    $response = $this->actingAs($this->viewerUser)
        ->withSession(['current_workspace_id' => $this->sharedWorkspace->id])
        ->get(route('recipes.index', ['recipe' => $this->recipe->id]));

    $response
        ->assertStatus(200)
        ->assertInertia(fn (Assert $page) => $page
            ->component('recipe/index')
            ->where('selected_recipe.id', $this->recipe->id)
        );
});

test('guest cannot access recipe routes', function () {
    /** @var \Tests\TestCase $this */
    $this->get(route('recipes.index'))->assertRedirect(route('login'));
    $this->get(route('recipes.create'))->assertRedirect(route('login'));
    $this->get(route('recipes.edit', $this->recipe))->assertRedirect(route('login'));
    $this->post(route('recipes.store'), $this->recipeStoreRequestData->transform())->assertRedirect(route('login'));
    $this->put(route('recipes.update', $this->recipe), $this->recipeUpdateRequestData->transform())->assertRedirect(route('login'));
    $this->delete(route('recipes.destroy', $this->recipe))->assertRedirect(route('login'));
});
