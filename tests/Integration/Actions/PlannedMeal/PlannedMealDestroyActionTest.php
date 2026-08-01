<?php

namespace Tests\Integration\Actions\PlannedMeal;

use App\Actions\PlannedMeal\PlannedMealDestroyAction;
use App\Actions\PlannedMeal\PlannedMealStoreAction;
use App\Data\Requests\PlannedMeal\PlannedMealDestroyRequestData;
use Illuminate\Auth\Access\AuthorizationException;

use function Pest\Laravel\assertDatabaseMissing;

beforeEach(function () {
    /** @var \Tests\TestCase $this */
    $this->setUpSharedWorkspaceContext();
    $this->setUpUserPlannedMealStoreRequestDataContext();
});

describe('PlannedMealDestroyAction', function () {
    test('successfully deletes a planned meal', function () {
        /** @var \Tests\TestCase $this */
        $plannedMeals = (app(PlannedMealStoreAction::class))->execute(
            $this->user,
            $this->user->defaultWorkspace(),
            $this->userPlannedMealStoreRequestData
        );

        $deletedCount = (app(PlannedMealDestroyAction::class))->execute(
            $this->user,
            $this->user->defaultWorkspace(),
            PlannedMealDestroyRequestData::from([
                'planned_meals' => collect($plannedMeals)->pluck('id')->all(),
            ])
        );

        expect($deletedCount)->toBe(1);

        assertDatabaseMissing('planned_meals', [
            'id' => $plannedMeals[0]->id,
        ]);
    });

    test('throws AuthorizationException when viewer attempts to delete a meal', function () {
        /** @var \Tests\TestCase $this */
        $plannedMeals = (app(PlannedMealStoreAction::class))->execute(
            $this->user,
            $this->sharedWorkspace,
            $this->userPlannedMealStoreRequestData
        );

        expect(function () use ($plannedMeals) {
            /** @var \Tests\TestCase $this */
            (app(PlannedMealDestroyAction::class))->execute(
                $this->viewerUser,
                $this->sharedWorkspace,
                PlannedMealDestroyRequestData::from([
                    'planned_meals' => collect($plannedMeals)->pluck('id')->all(),
                ])
            );
        })->toThrow(AuthorizationException::class);
    });
});
