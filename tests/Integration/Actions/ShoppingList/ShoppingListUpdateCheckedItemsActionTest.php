<?php

namespace Tests\Integration\Actions\ShoppingList;

use App\Actions\PlannedMeal\PlannedMealStoreAction;
use App\Actions\ShoppingList\ShoppingListUpdateCheckedItemsAction;
use App\Data\Requests\ShoppingList\Entities\ShoppingListPlannedMealIngredientRequestData;
use App\Data\Requests\ShoppingList\ShoppingListUpdateRequestData;
use App\Models\ShoppingListPlannedMealIngredient;
use Illuminate\Auth\Access\AuthorizationException;
use Symfony\Component\HttpKernel\Exception\HttpException;

test('updates checked status', function () {
    /** @var \Tests\TestCase $this */
    $plannedMeals = app(PlannedMealStoreAction::class)->execute(
        $this->user,
        $this->defaultWorkspace,
        $this->userPlannedMealStoreRequestData
    );
    $shoppingList = $this->findShoppingListForWorkspaceAndDate($this->defaultWorkspace, $plannedMeals[0]->planned_date);
    $ingredient = $shoppingList->plannedMealIngredients()->firstOrFail();

    app(ShoppingListUpdateCheckedItemsAction::class)->execute(
        $this->user,
        $this->defaultWorkspace,
        ShoppingListUpdateRequestData::from([
            'shopping_list_planned_meal_ingredients' => [
                ShoppingListPlannedMealIngredientRequestData::from([
                    'shopping_list_id' => $shoppingList->id,
                    'planned_meal_id' => $ingredient->planned_meal_id,
                    'ingredient_id' => $ingredient->ingredient_id,
                    'is_checked' => true,
                ])->transform(),
            ],
        ])
    );

    expect($ingredient->refresh()->is_checked)->toBeTrue();
});

test('throws an authorization exception when viewer updates a shared workspace list', function () {
    /** @var \Tests\TestCase $this */
    $plannedMeals = app(PlannedMealStoreAction::class)->execute(
        $this->user,
        $this->sharedWorkspace,
        $this->userPlannedMealStoreRequestData
    );
    $shoppingList = $this->findShoppingListForWorkspaceAndDate($this->sharedWorkspace, $plannedMeals[0]->planned_date);
    $ingredient = $shoppingList->plannedMealIngredients()->firstOrFail();

    expect(fn () => app(ShoppingListUpdateCheckedItemsAction::class)->execute(
        $this->viewerUser,
        $this->sharedWorkspace,
        ShoppingListUpdateRequestData::from([
            'shopping_list_planned_meal_ingredients' => [
                ShoppingListPlannedMealIngredientRequestData::from([
                    'shopping_list_id' => $shoppingList->id,
                    'planned_meal_id' => $ingredient->planned_meal_id,
                    'ingredient_id' => $ingredient->ingredient_id,
                    'is_checked' => true,
                ])->toArray(),
            ],
        ])
    ))->toThrow(AuthorizationException::class);

    expect($ingredient->refresh()->is_checked)->toBeFalse();
});

test('rolls back all changes when one ingredient belongs to another workspace', function () {
    /** @var \Tests\TestCase $this */
    $plannedMeals = app(PlannedMealStoreAction::class)->execute(
        $this->user,
        $this->defaultWorkspace,
        $this->userPlannedMealStoreRequestData
    );
    $otherPlannedMeals = app(PlannedMealStoreAction::class)->execute(
        $this->otherUser,
        $this->otherUserSharedWorkspace,
        $this->otherUserPlannedMealStoreRequestData
    );

    $shoppingList = $this->findShoppingListForWorkspaceAndDate($this->defaultWorkspace, $plannedMeals[0]->planned_date);
    $otherShoppingList = $this->findShoppingListForWorkspaceAndDate($this->otherUserSharedWorkspace, $otherPlannedMeals[0]->planned_date);
    $ingredient = $shoppingList->plannedMealIngredients()->firstOrFail();
    $otherIngredient = $otherShoppingList->plannedMealIngredients()->firstOrFail();

    expect(fn () => app(ShoppingListUpdateCheckedItemsAction::class)->execute(
        $this->user,
        $this->defaultWorkspace,
        ShoppingListUpdateRequestData::from([
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
        ])
    ))->toThrow(HttpException::class);

    expect(ShoppingListPlannedMealIngredient::find($ingredient->id)->is_checked)->toBeFalse();
    expect(ShoppingListPlannedMealIngredient::find($otherIngredient->id)->is_checked)->toBeFalse();
});
