<?php

namespace Tests\Feature\ShoppingList;

use App\Actions\PlannedMeal\PlannedMealStoreAction;
use App\Actions\Recipes\RecipeDestroyAction;
use App\Data\Requests\PlannedMeal\Entities\PlannedMealRequestData;
use App\Data\Requests\PlannedMeal\PlannedMealStoreRequestData;
use App\Data\Requests\Recipe\RecipeDestroyRequestData;
use App\Models\PlannedMeal;

beforeEach(function () {
    /** @var \Tests\TestCase $this */
    $this->setUpUserPlannedMealStoreRequestDataContext();
    $this->setUpUserSecondPlannedMealRequestDataContext();
});

test('synchronizes when a recipe with planned meals is deleted', function () {
    /** @var \Tests\TestCase $this */
    $plannedMeals = app(PlannedMealStoreAction::class)->execute(
        $this->user,
        $this->user->defaultWorkspace(),
        $this->userPlannedMealStoreRequestData
    );
    $plannedMeal = $plannedMeals[0];

    $shoppingList = $this->findShoppingListForWorkspaceAndDate($this->user->defaultWorkspace(), $plannedMeal->planned_date);

    expect($shoppingList->plannedMealIngredients)->toHaveCount($this->recipe->ingredients()->count());

    app(RecipeDestroyAction::class)->execute(
        $this->user,
        RecipeDestroyRequestData::from(['ids' => [$this->recipe->id]])
    );

    expect(PlannedMeal::query()->find($plannedMeal->id))->toBeNull();

    expect($shoppingList->refresh()->plannedMealIngredients)->toHaveCount(0);
});

test('synchronizes multiple weeks when a recipe with multiple planned meals is deleted', function () {
    /** @var \Tests\TestCase $this */
    $weekOneDate = now()->startOfWeek()->addWeek()->format('Y-m-d');
    $weekOneSecondDate = now()->startOfWeek()->addWeek()->addDay()->format('Y-m-d');
    $weekTwoDate = now()->startOfWeek()->addWeeks(2)->format('Y-m-d');

    $plannedMeals = app(PlannedMealStoreAction::class)->execute(
        $this->user,
        $this->user->defaultWorkspace(),
        PlannedMealStoreRequestData::from([
            'planned_meals' => [
                PlannedMealRequestData::from([
                    ...$this->userPlannedMealRequestData->except('planned_date')->transform(),
                    'planned_date' => $weekOneDate,
                ])->toArray(),
                PlannedMealRequestData::from([
                    ...$this->userSecondPlannedMealRequestData->except('planned_date')->transform(),
                    'planned_date' => $weekOneSecondDate,
                ])->toArray(),
                PlannedMealRequestData::from([
                    ...$this->userPlannedMealRequestData->except('planned_date')->transform(),
                    'planned_date' => $weekTwoDate,
                ])->toArray(),
            ],
        ])
    );

    [$deletedRecipeWeekOnePlannedMeal, $remainingWeekOnePlannedMeal, $deletedRecipeWeekTwoPlannedMeal] = $plannedMeals;

    $shoppingListWeekOne = $this->findShoppingListForWorkspaceAndDate($this->user->defaultWorkspace(), $weekOneDate);
    $shoppingListWeekTwo = $this->findShoppingListForWorkspaceAndDate($this->user->defaultWorkspace(), $weekTwoDate);

    expect($shoppingListWeekOne->plannedMealIngredients)->toHaveCount(
        $this->recipe->ingredients()->count() + $this->otherRecipe->ingredients()->count()
    );
    expect($shoppingListWeekTwo->plannedMealIngredients)->toHaveCount($this->recipe->ingredients()->count());

    app(RecipeDestroyAction::class)->execute(
        $this->user,
        RecipeDestroyRequestData::from(['ids' => [$this->recipe->id]])
    );

    expect(PlannedMeal::query()->find($deletedRecipeWeekOnePlannedMeal->id))->toBeNull();
    expect(PlannedMeal::query()->find($deletedRecipeWeekTwoPlannedMeal->id))->toBeNull();
    expect(PlannedMeal::query()->find($remainingWeekOnePlannedMeal->id))->not->toBeNull();

    $shoppingListWeekOne->refresh();
    $shoppingListWeekTwo->refresh();

    expect($shoppingListWeekOne->plannedMealIngredients)->toHaveCount($this->otherRecipe->ingredients()->count());
    expect($shoppingListWeekOne->plannedMealIngredients()->where('planned_meal_id', $remainingWeekOnePlannedMeal->id)->count())
        ->toBe($this->otherRecipe->ingredients()->count());
    expect($shoppingListWeekOne->plannedMealIngredients()->where('planned_meal_id', $deletedRecipeWeekOnePlannedMeal->id)->count())
        ->toBe(0);
    expect($shoppingListWeekTwo->plannedMealIngredients)->toHaveCount(0);
});

test('does not change when deleting a recipe without planned meals', function () {
    /** @var \Tests\TestCase $this */
    $plannedMeals = app(PlannedMealStoreAction::class)->execute(
        $this->user,
        $this->user->defaultWorkspace(),
        PlannedMealStoreRequestData::from([
            'planned_meals' => [
                PlannedMealRequestData::from($this->userSecondPlannedMealRequestData)->toArray(),
            ],
        ])
    );
    $plannedMeal = $plannedMeals[0];

    $shoppingList = $this->findShoppingListForWorkspaceAndDate($this->user->defaultWorkspace(), $plannedMeal->planned_date);

    expect($shoppingList->plannedMealIngredients)->toHaveCount($this->otherRecipe->ingredients()->count());

    app(RecipeDestroyAction::class)->execute(
        $this->user,
        RecipeDestroyRequestData::from(['ids' => [$this->recipe->id]])
    );

    expect(PlannedMeal::query()->find($plannedMeal->id))->not->toBeNull();
    expect($shoppingList->refresh()->plannedMealIngredients)->toHaveCount($this->otherRecipe->ingredients()->count());
});
