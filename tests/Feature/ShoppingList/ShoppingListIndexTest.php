<?php

namespace Tests\Feature\ShoppingList;

use App\Actions\PlannedMeal\PlannedMealStoreAction;
use App\Data\Requests\PlannedMeal\Entities\PlannedMealRequestData;
use App\Data\Requests\PlannedMeal\PlannedMealStoreRequestData;
use App\Models\PlannedMeal;
use Carbon\Carbon;
use Inertia\Testing\AssertableInertia;

test('renders the screen', function () {
    /** @var \Tests\TestCase $this */
    $this->actingAs($this->user)
        ->get(route('shopping-lists.index'))
        ->assertStatus(200)
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('shopping-lists/index')
                ->has('shopping_list_data')
                ->has('weekStart')
                ->has('workspace_data')
        );
});

test('shows the current week by default', function () {
    /** @var \Tests\TestCase $this */
    $thisWeekDate = now()->startOfWeek()->addDay()->format('Y-m-d');
    $nextWeekDate = now()->startOfWeek()->addWeek()->addDay()->format('Y-m-d');

    app(PlannedMealStoreAction::class)->execute(
        $this->user,
        $this->defaultWorkspace,
        PlannedMealStoreRequestData::from([
            'planned_meals' => [
                PlannedMealRequestData::from([
                    ...$this->userPlannedMealRequestData->except('planned_date')->transform(),
                    'planned_date' => $thisWeekDate,
                ])->toArray(),
            ],
        ])
    );
    app(PlannedMealStoreAction::class)->execute(
        $this->user,
        $this->defaultWorkspace,
        PlannedMealStoreRequestData::from([
            'planned_meals' => [
                PlannedMealRequestData::from([
                    ...$this->userPlannedMealRequestData->except('planned_date')->transform(),
                    'planned_date' => $nextWeekDate,
                ])->toArray(),
            ],
        ])
    );

    $thisWeekStart = Carbon::parse($thisWeekDate)->startOfWeek();

    $this->actingAs($this->user)
        ->get(route('shopping-lists.index'))
        ->assertStatus(200)
        ->assertInertia(function ($page) use ($thisWeekStart) {
            expect($page->toArray()['props']['weekStart'])->toBe($thisWeekStart->format('Y-m-d'));
            expect($page->toArray()['props']['shopping_list_data']['workspace_id'])->toBe($this->defaultWorkspace->id);

            return true;
        });
});

test('filters by week', function () {
    /** @var \Tests\TestCase $this */
    $nextWeekDate = now()->startOfWeek()->addWeek()->addDay()->format('Y-m-d');

    app(PlannedMealStoreAction::class)->execute(
        $this->user,
        $this->defaultWorkspace,
        PlannedMealStoreRequestData::from([
            'planned_meals' => [
                PlannedMealRequestData::from([
                    ...$this->userPlannedMealRequestData->except('planned_date')->transform(),
                    'planned_date' => $nextWeekDate,
                ])->toArray(),
            ],
        ])
    );

    $nextWeekStart = Carbon::parse($nextWeekDate)->startOfWeek();

    $this->actingAs($this->user)
        ->get(route('shopping-lists.index', ['week' => $nextWeekStart->format('Y-m-d')]))
        ->assertStatus(200)
        ->assertInertia(function ($page) use ($nextWeekStart) {
            expect($page->toArray()['props']['weekStart'])->toBe($nextWeekStart->format('Y-m-d'));
            expect($page->toArray()['props']['shopping_list_data']['workspace_id'])->toBe($this->defaultWorkspace->id);

            return true;
        });
});

test('returns an empty list when the week has no planned meals', function () {
    /** @var \Tests\TestCase $this */
    $this->actingAs($this->user)
        ->get(route('shopping-lists.index'))
        ->assertStatus(200)
        ->assertInertia(function ($page) {
            expect($page->toArray()['props']['shopping_list_data'])->toBeEmpty();

            return true;
        });
});

test('falls back to the default workspace when current workspace is inaccessible', function () {
    /** @var \Tests\TestCase $this */
    $plannedDate = now()->startOfWeek()->addDay()->format('Y-m-d');

    PlannedMeal::factory()->create([
        'user_id' => $this->otherUser->id,
        'recipe_id' => $this->otherUserRecipe->id,
        'meal_time_id' => $this->mealTime->id,
        'planned_date' => $plannedDate,
        'workspace_id' => $this->otherUserSharedWorkspace->id,
    ]);

    $weekStart = Carbon::parse($plannedDate)->startOfWeek();

    $this->actingAs($this->user)
        ->withSession(['current_workspace_id' => $this->otherUserSharedWorkspace->id])
        ->get(route('shopping-lists.index', ['week' => $weekStart->format('Y-m-d')]))
        ->assertStatus(200)
        ->assertInertia(function ($page) {
            $currentWorkspace = $page->toArray()['props']['workspace_data']['current_workspace'];

            expect($currentWorkspace['id'])->toBe($this->defaultWorkspace->id);
            expect($currentWorkspace['id'])->not->toBe($this->otherUserSharedWorkspace->id);
            expect($page->toArray()['props']['shopping_list_data'])->toBeEmpty();

            return true;
        });
});
