<?php

namespace Tests\Feature\ShoppingList;

use App\Actions\PlannedMeal\PlannedMealStoreAction;
use App\Data\Requests\ShoppingList\Entities\ShoppingListPlannedMealIngredientRequestData;
use App\Data\Requests\ShoppingList\ShoppingListUpdateRequestData;
use App\Models\ShoppingListPlannedMealIngredient;

beforeEach(function () {
    /** @var \Tests\TestCase $this */
    $this->setUpSharedWorkspaceContext();
    $this->setUpOtherUserSharedWorkspaceContext();
    $this->setUpUserPlannedMealStoreRequestDataContext();
    $this->setUpOtherUserPlannedMealStoreRequestDataContext();
});

test('owner can check and uncheck an ingredient', function () {
    /** @var \Tests\TestCase $this */
    $plannedMeals = app(PlannedMealStoreAction::class)->execute(
        $this->user,
        $this->user->defaultWorkspace(),
        $this->userPlannedMealStoreRequestData
    );
    $shoppingList = $this->findShoppingListForWorkspaceAndDate($this->user->defaultWorkspace(), $plannedMeals[0]->planned_date);
    $ingredient = $shoppingList->plannedMealIngredients()->firstOrFail();

    expect($ingredient->is_checked)->toBeFalse();

    $this->actingAs($this->user)
        ->put(route('shopping-lists.update'), ShoppingListUpdateRequestData::from([
            'shopping_list_planned_meal_ingredients' => [
                ShoppingListPlannedMealIngredientRequestData::from([
                    'shopping_list_id' => $shoppingList->id,
                    'planned_meal_id' => $ingredient->planned_meal_id,
                    'ingredient_id' => $ingredient->ingredient_id,
                    'is_checked' => true,
                ])->toArray(),
            ],
        ])->transform())
        ->assertStatus(302)
        ->assertSessionHas('success');

    expect($ingredient->refresh()->is_checked)->toBeTrue();

    $this->actingAs($this->user)
        ->put(route('shopping-lists.update'), ShoppingListUpdateRequestData::from([
            'shopping_list_planned_meal_ingredients' => [
                ShoppingListPlannedMealIngredientRequestData::from([
                    'shopping_list_id' => $shoppingList->id,
                    'planned_meal_id' => $ingredient->planned_meal_id,
                    'ingredient_id' => $ingredient->ingredient_id,
                    'is_checked' => false,
                ])->toArray(),
            ],
        ])->transform())
        ->assertStatus(302);

    expect($ingredient->refresh()->is_checked)->toBeFalse();
});

test('editor can update an ingredient in a shared workspace', function () {
    /** @var \Tests\TestCase $this */
    $plannedMeals = app(PlannedMealStoreAction::class)->execute(
        $this->user,
        $this->sharedWorkspace,
        $this->userPlannedMealStoreRequestData
    );
    $shoppingList = $this->findShoppingListForWorkspaceAndDate($this->sharedWorkspace, $plannedMeals[0]->planned_date);
    $ingredient = $shoppingList->plannedMealIngredients()->firstOrFail();

    $this->withSession(['current_workspace_id' => $this->sharedWorkspace->id])
        ->actingAs($this->editorUser)
        ->put(route('shopping-lists.update'), ShoppingListUpdateRequestData::from([
            'shopping_list_planned_meal_ingredients' => [
                ShoppingListPlannedMealIngredientRequestData::from([
                    'shopping_list_id' => $shoppingList->id,
                    'planned_meal_id' => $ingredient->planned_meal_id,
                    'ingredient_id' => $ingredient->ingredient_id,
                    'is_checked' => true,
                ])->toArray(),
            ],
        ])->transform())
        ->assertStatus(302)
        ->assertSessionHas('success', 'Ingredient updated successfully');

    expect($ingredient->refresh()->is_checked)->toBeTrue();
});

test('viewer cannot update an ingredient in a shared workspace', function () {
    /** @var \Tests\TestCase $this */
    $plannedMeals = app(PlannedMealStoreAction::class)->execute(
        $this->user,
        $this->sharedWorkspace,
        $this->userPlannedMealStoreRequestData
    );
    $shoppingList = $this->findShoppingListForWorkspaceAndDate($this->sharedWorkspace, $plannedMeals[0]->planned_date);
    $ingredient = $shoppingList->plannedMealIngredients()->firstOrFail();

    $this->withSession(['current_workspace_id' => $this->sharedWorkspace->id])
        ->actingAs($this->viewerUser)
        ->put(route('shopping-lists.update'), ShoppingListUpdateRequestData::from([
            'shopping_list_planned_meal_ingredients' => [
                ShoppingListPlannedMealIngredientRequestData::from([
                    'shopping_list_id' => $shoppingList->id,
                    'planned_meal_id' => $ingredient->planned_meal_id,
                    'ingredient_id' => $ingredient->ingredient_id,
                    'is_checked' => true,
                ])->toArray(),
            ],
        ])->transform())
        ->assertStatus(302)
        ->assertSessionHas('error', 'This action is unauthorized');

    expect($ingredient->refresh()->is_checked)->toBeFalse();
});

test('user cannot update an ingredient outside the current workspace', function () {
    /** @var \Tests\TestCase $this */
    $plannedMeals = app(PlannedMealStoreAction::class)->execute(
        $this->otherUser,
        $this->otherUserSharedWorkspace,
        $this->otherUserPlannedMealStoreRequestData
    );
    $shoppingList = $this->findShoppingListForWorkspaceAndDate($this->otherUserSharedWorkspace, $plannedMeals[0]->planned_date);
    $ingredient = $shoppingList->plannedMealIngredients()->firstOrFail();

    $this->actingAs($this->user)
        ->put(route('shopping-lists.update'), ShoppingListUpdateRequestData::from([
            'shopping_list_planned_meal_ingredients' => [
                ShoppingListPlannedMealIngredientRequestData::from([
                    'shopping_list_id' => $shoppingList->id,
                    'planned_meal_id' => $ingredient->planned_meal_id,
                    'ingredient_id' => $ingredient->ingredient_id,
                    'is_checked' => true,
                ])->toArray(),
            ],
        ])->transform())
        ->assertStatus(302)
        ->assertSessionHas('error', 'This action is unauthorized');

    expect($ingredient->refresh()->is_checked)->toBeFalse();
});

test('validates nested ingredient checked status', function () {
    /** @var \Tests\TestCase $this */
    $plannedMeals = app(PlannedMealStoreAction::class)->execute(
        $this->user,
        $this->user->defaultWorkspace(),
        $this->userPlannedMealStoreRequestData
    );
    $shoppingList = $this->findShoppingListForWorkspaceAndDate($this->user->defaultWorkspace(), $plannedMeals[0]->planned_date);
    $ingredient = $shoppingList->plannedMealIngredients()->firstOrFail();

    $this->actingAs($this->user)
        ->put(route('shopping-lists.update'), [
            'shopping_list_planned_meal_ingredients' => [[
                'shopping_list_id' => $shoppingList->id,
                'planned_meal_id' => $ingredient->planned_meal_id,
                'ingredient_id' => $ingredient->ingredient_id,
                'is_checked' => 'invalid',
            ]],
        ])
        ->assertStatus(302)
        ->assertSessionHasErrors(['shopping_list_planned_meal_ingredients.0.is_checked']);

    $this->actingAs($this->user)
        ->put(route('shopping-lists.update'), [
            'shopping_list_planned_meal_ingredients' => [[
                'shopping_list_id' => $shoppingList->id,
                'planned_meal_id' => $ingredient->planned_meal_id,
                'ingredient_id' => $ingredient->ingredient_id,
            ]],
        ])
        ->assertStatus(302)
        ->assertSessionHasErrors(['shopping_list_planned_meal_ingredients.0.is_checked']);
});

test('keeps bulk update atomic when one ingredient is forbidden', function () {
    /** @var \Tests\TestCase $this */
    $plannedMeals = app(PlannedMealStoreAction::class)->execute(
        $this->user,
        $this->user->defaultWorkspace(),
        $this->userPlannedMealStoreRequestData
    );
    $otherPlannedMeals = app(PlannedMealStoreAction::class)->execute(
        $this->otherUser,
        $this->otherUserSharedWorkspace,
        $this->otherUserPlannedMealStoreRequestData
    );

    $shoppingList = $this->findShoppingListForWorkspaceAndDate($this->user->defaultWorkspace(), $plannedMeals[0]->planned_date);
    $otherShoppingList = $this->findShoppingListForWorkspaceAndDate($this->otherUserSharedWorkspace, $otherPlannedMeals[0]->planned_date);

    $ingredient = $shoppingList->plannedMealIngredients()->firstOrFail();
    $otherIngredient = $otherShoppingList->plannedMealIngredients()->firstOrFail();

    $this->actingAs($this->user)
        ->put(route('shopping-lists.update'), ShoppingListUpdateRequestData::from([
            'shopping_list_planned_meal_ingredients' => [
                ShoppingListPlannedMealIngredientRequestData::from([
                    'shopping_list_id' => $shoppingList->id,
                    'planned_meal_id' => $ingredient->planned_meal_id,
                    'ingredient_id' => $ingredient->ingredient_id,
                    'is_checked' => true,
                ])->toArray(),
                ShoppingListPlannedMealIngredientRequestData::from([
                    'shopping_list_id' => $otherShoppingList->id,
                    'planned_meal_id' => $otherIngredient->planned_meal_id,
                    'ingredient_id' => $otherIngredient->ingredient_id,
                    'is_checked' => true,
                ])->toArray(),
            ],
        ])->transform())
        ->assertStatus(302)
        ->assertSessionHas('error', 'This action is unauthorized');

    expect(ShoppingListPlannedMealIngredient::find($ingredient->id)->is_checked)->toBeFalse();
    expect(ShoppingListPlannedMealIngredient::find($otherIngredient->id)->is_checked)->toBeFalse();
});
