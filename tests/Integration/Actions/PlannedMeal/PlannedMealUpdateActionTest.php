<?php

namespace Tests\Integration\Actions\PlannedMeal;

use App\Actions\PlannedMeal\PlannedMealStoreAction;
use App\Actions\PlannedMeal\PlannedMealUpdateAction;
use App\Data\Requests\PlannedMeal\PlannedMealUpdateRequestData;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

use function Pest\Laravel\assertDatabaseHas;

describe('PlannedMealUpdateAction', function () {
    test('successfully updates a planned meal', function () {
        /** @var \Tests\TestCase $this */
        $plannedMeals = (app(PlannedMealStoreAction::class))->execute(
            $this->user,
            $this->defaultWorkspace,
            $this->userPlannedMealStoreRequestData
        );

        $updatedPlannedMeal = (app(PlannedMealUpdateAction::class))->execute(
            $this->user,
            $plannedMeals[0],
            $this->userPlannedMealUpdateRequestData
        );

        expect($updatedPlannedMeal->id)->toBe($plannedMeals[0]->id);

        assertDatabaseHas('planned_meals', [
            'id' => $plannedMeals[0]->id,
            'workspace_id' => $this->defaultWorkspace->id,
            'user_id' => $this->user->id,
            ...$this->userPlannedMealUpdateRequestData->transform(),
        ]);
    });

    test('throws AuthorizationException when viewer attempts to update a meal', function () {
        /** @var \Tests\TestCase $this */
        $plannedMeals = (app(PlannedMealStoreAction::class))->execute(
            $this->user,
            $this->sharedWorkspace,
            $this->userPlannedMealStoreRequestData
        );

        expect(function () use ($plannedMeals) {
            /** @var \Tests\TestCase $this */
            (app(PlannedMealUpdateAction::class))->execute(
                $this->viewerUser,
                $plannedMeals[0],
                $this->viewerPlannedMealUpdateRequestData
            );
        })->toThrow(AuthorizationException::class);
    });

    test('throws NotFoundException when updating non-existent planned meal', function () {
        /** @var \Tests\TestCase $this */
        $plannedMeals = (app(PlannedMealStoreAction::class))->execute(
            $this->user,
            $this->defaultWorkspace,
            $this->userPlannedMealStoreRequestData
        );

        expect(function () use ($plannedMeals) {
            /** @var \Tests\TestCase $this */
            (app(PlannedMealUpdateAction::class))->execute(
                $this->user,
                $plannedMeals[0],
                PlannedMealUpdateRequestData::from([
                    'recipe_id' => 'non-existent-uuid',
                    'meal_time_id' => $this->mealTime->id,
                    'planned_date' => now()->addDays(2)->format('Y-m-d'),
                    'serving_size' => 2,
                ])
            );
        })->toThrow(ModelNotFoundException::class);
    });
});
