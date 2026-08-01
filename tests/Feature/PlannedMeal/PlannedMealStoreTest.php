<?php

namespace Tests\Feature\PlannedMeal;

beforeEach(function () {
    /** @var \Tests\TestCase $this */
    $this->setUpSharedWorkspaceContext();
    $this->setUpUserPlannedMealStoreRequestDataContext();
    $this->setUpUserMultiplePlannedMealStoreRequestDataContext();
    $this->setUpUserInvalidPlannedMealStoreRequestDataContext();
    $this->setUpViewerPlannedMealStoreRequestDataContext();
});

describe('PlannedMealStore', function () {
    describe('validation errors', function () {
        test('when recipe not valid', function () {
            /** @var \Tests\TestCase $this */
            $response = $this->actingAs($this->user)
                ->post(
                    route('planned-meals.store'),
                    $this->userInvalidPlannedMealStoreRequestData->transform()
                )->assertSessionHasErrors();
        });
    });

    describe('authorization errors', function () {
        test('when viewer attempts to plan a meal in a sharedWorkspace', function () {
            /** @var \Tests\TestCase $this */
            $response = $this->actingAs($this->viewerUser)
                ->withSession(['current_workspace_id' => $this->sharedWorkspace->id])
                ->post(route('planned-meals.store'), $this->viewerPlannedMealStoreRequestData->transform())
                ->assertSessionHas(
                    'error',
                    'This action is unauthorized',
                );
        });
    });

    describe('success messages', function () {
        test('when single meal is valid', function () {
            /** @var \Tests\TestCase $this */
            $this->actingAs($this->user)
                ->post(route('planned-meals.store'), $this->userPlannedMealStoreRequestData->transform())
                ->assertSessionHas('success', 'Meal successfully planned');
        });

        test('when multiple meals are valid', function () {
            /** @var \Tests\TestCase $this */
            $this->actingAs($this->user)
                ->post(
                    route('planned-meals.store'),
                    $this->userMultiplePlannedMealStoreRequestData->transform()
                )
                ->assertSessionHas('success', 'Meal successfully planned');
        });

        test('when meal is duplicate', function () {
            /** @var \Tests\TestCase $this */
            $this->actingAs($this->user)
                ->post(
                    route('planned-meals.store'),
                    $this->userPlannedMealStoreRequestData->transform()
                );

            $this->actingAs($this->user)
                ->post(
                    route('planned-meals.store'),
                    $this->userPlannedMealStoreRequestData->transform()
                )
                ->assertSessionHas('success', 'Meal successfully planned');
        });
    });
});
