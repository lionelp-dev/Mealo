<?php

namespace Tests\Integration\Actions\ShoppingList;

use App\Actions\ShoppingList\ShoppingListSyncAction;
use App\Data\Requests\PlannedMeal\Entities\PlannedMealRequestData;
use App\Models\PlannedMeal;
use App\Models\ShoppingList;
use Carbon\Carbon;

test('creates a shopping list for the planned meal week', function () {
    /** @var \Tests\TestCase $this */
    $plannedMeal = PlannedMeal::withoutEvents(fn () => PlannedMeal::query()->create([
        'user_id' => $this->user->id,
        'workspace_id' => $this->defaultWorkspace->id,
        ...$this->userPlannedMealRequestData->transform(),
    ]));

    app(ShoppingListSyncAction::class)($plannedMeal);

    $shoppingList = $this->findShoppingListForWorkspaceAndDate($this->defaultWorkspace, $plannedMeal->planned_date);

    expect($shoppingList->plannedMealIngredients)->toHaveCount($this->recipe->ingredients->count());
});

test('removes ingredients for deleted planned meals', function () {
    /** @var \Tests\TestCase $this */
    $plannedMeals = PlannedMeal::withoutEvents(fn () => [
        PlannedMeal::query()->create([
            'user_id' => $this->user->id,
            'workspace_id' => $this->defaultWorkspace->id,
            ...$this->userPlannedMealRequestData->transform(),
        ]),
        PlannedMeal::query()->create([
            'user_id' => $this->user->id,
            'workspace_id' => $this->defaultWorkspace->id,
            ...$this->userSecondPlannedMealRequestData->transform(),
        ]),
    ]);

    app(ShoppingListSyncAction::class)($plannedMeals[0]);

    $shoppingList = $this->findShoppingListForWorkspaceAndDate($this->defaultWorkspace, $plannedMeals[0]->planned_date);
    $initialCount = $shoppingList->plannedMealIngredients()->count();

    PlannedMeal::withoutEvents(fn () => $plannedMeals[1]->delete());
    app(ShoppingListSyncAction::class)($plannedMeals[1]);

    $shoppingList->refresh();

    expect($initialCount)->toBeGreaterThan($shoppingList->plannedMealIngredients()->count());
    expect($shoppingList->plannedMealIngredients()->where('planned_meal_id', $plannedMeals[1]->id)->count())->toBe(0);
});

test('preserves checked status when resyncing', function () {
    /** @var \Tests\TestCase $this */
    $plannedMeal = PlannedMeal::withoutEvents(fn () => PlannedMeal::query()->create([
        'user_id' => $this->user->id,
        'workspace_id' => $this->defaultWorkspace->id,
        ...$this->userPlannedMealRequestData->transform(),
    ]));

    app(ShoppingListSyncAction::class)($plannedMeal);

    $shoppingList = $this->findShoppingListForWorkspaceAndDate($this->defaultWorkspace, $plannedMeal->planned_date);
    $ingredient = $shoppingList->plannedMealIngredients()->firstOrFail();
    $ingredient->update(['is_checked' => true]);

    app(ShoppingListSyncAction::class)($plannedMeal);

    $resyncedIngredient = $shoppingList->plannedMealIngredients()
        ->where('planned_meal_id', $ingredient->planned_meal_id)
        ->where('ingredient_id', $ingredient->ingredient_id)
        ->where('unit', $ingredient->unit)
        ->firstOrFail();

    expect($resyncedIngredient->is_checked)->toBeTrue();
});

test('syncs each workspace independently', function () {
    /** @var \Tests\TestCase $this */
    $plannedDate = now()->addDay();
    $plannedMealRequestData = PlannedMealRequestData::from([
        ...$this->userPlannedMealRequestData->except('planned_date')->transform(),
        'planned_date' => $plannedDate,
    ]);

    $personalPlannedMeal = PlannedMeal::withoutEvents(fn () => PlannedMeal::query()->create([
        'user_id' => $this->user->id,
        'workspace_id' => $this->defaultWorkspace->id,
        ...$plannedMealRequestData->transform(),
    ]));

    $sharedPlannedMeal = PlannedMeal::withoutEvents(fn () => PlannedMeal::query()->create([
        'user_id' => $this->user->id,
        'workspace_id' => $this->sharedWorkspace->id,
        ...$plannedMealRequestData->transform(),
    ]));

    app(ShoppingListSyncAction::class)($personalPlannedMeal);
    app(ShoppingListSyncAction::class)($sharedPlannedMeal);

    $weekStart = Carbon::parse($plannedDate)->startOfWeek();
    $shoppingLists = ShoppingList::query()
        ->whereDate('week_start', $weekStart->toDateString())
        ->whereIn('workspace_id', [$this->defaultWorkspace->id, $this->sharedWorkspace->id])
        ->get();

    expect($shoppingLists)->toHaveCount(2);
    expect($shoppingLists->pluck('workspace_id')->all())->toContain($this->defaultWorkspace->id, $this->sharedWorkspace->id);
});
