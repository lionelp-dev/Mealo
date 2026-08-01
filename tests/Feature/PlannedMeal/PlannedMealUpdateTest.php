<?php

namespace Tests\Feature\PlannedMeal;

use App\Actions\PlannedMeal\PlannedMealStoreAction;

beforeEach(function () {
    /** @var \Tests\TestCase $this */
    $this->setUpSharedWorkspaceContext();
    $this->setUpUserPlannedMealStoreRequestDataContext();
    $this->setUpUserDuplicatePlannedMealStoreRequestDataContext();
    $this->setUpUserInvalidPlannedMealStoreRequestDataContext();
    $this->setUpUserPlannedMealUpdateRequestDataContext();
    $this->setUpViewerPlannedMealUpdateRequestDataContext();
});

describe('PlannedMealUpdate', function () {
    describe('success messages', function () {
        test('when update data is valid', function () {
            /** @var \Tests\TestCase $this */
            $planned_meals = (app(PlannedMealStoreAction::class))->execute(
                $this->user,
                $this->user->defaultWorkspace(),
                $this->userPlannedMealStoreRequestData
            );

            $this->actingAs($this->user)
                ->put(
                    route(
                        'planned-meals.update',
                        $planned_meals[0]
                    ),
                    $this->userPlannedMealUpdateRequestData->transform()
                )
                ->assertSessionHas('success', 'Planned meal successfully updated');
        });

        test('when meal is duplicate', function () {
            /** @var \Tests\TestCase $this */
            $planned_meals = (app(PlannedMealStoreAction::class))->execute(
                $this->user,
                $this->user->defaultWorkspace(),
                $this->userDuplicatePlannedMealStoreRequestData
            );

            $this->actingAs($this->user)
                ->put(
                    route(
                        'planned-meals.update',
                        $planned_meals[0]
                    ),
                    $this->userPlannedMealUpdateRequestData->transform()
                )
                ->assertSessionHas('success', 'Planned meal successfully updated');
        });
    });

    describe('validation errors', function () {
        test('when data is invalid', function () {
            /** @var \Tests\TestCase $this */
            $planned_meals = (app(PlannedMealStoreAction::class))->execute(
                $this->user,
                $this->user->defaultWorkspace(),
                $this->userPlannedMealStoreRequestData
            );

            $response = $this->actingAs($this->user)
                ->put(
                    route(
                        'planned-meals.update',
                        $planned_meals[0]
                    ),
                    $this->userInvalidPlannedMealStoreRequestData
                        ->transform(),
                )
                ->assertSessionHasErrors();
        });
    });

    describe('forbidden messages', function () {
        test('when user is unauthorized', function () {
            /** @var \Tests\TestCase $this */
            $planned_meals = (app(PlannedMealStoreAction::class))->execute(
                $this->user,
                $this->sharedWorkspace,
                $this->userPlannedMealStoreRequestData
            );

            $response = $this->actingAs($this->viewerUser)
                ->withSession(['current_workspace_id' => $this->sharedWorkspace->id])
                ->put(
                    route(
                        'planned-meals.update',
                        $planned_meals[0]
                    ),
                    $this->viewerPlannedMealUpdateRequestData
                        ->transform(),
                )
                ->assertSessionHas('success', 'Planned meal unsuccessfully updated');
        });
    });
});
