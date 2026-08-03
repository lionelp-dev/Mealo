<?php

use App\Actions\PlannedMeal\PlannedMealStoreAction;
use App\Data\Requests\PlannedMeal\PlannedMealDestroyRequestData;
use App\Messages\PlannedMeal\PlannedMealUnplannedMessage;

beforeEach(function () {
    /** @var \Tests\TestCase $this */
    $this->setUpUserPlannedMealStoreRequestDataContext();
});

describe('PlannedMealDestroyTest', function () {
    describe('success messages', function () {
        test('when a planned meal successfully removed', function () {
            /** @var \Tests\TestCase $this */
            $plannedMeals = (app(PlannedMealStoreAction::class))->execute(
                $this->user,
                $this->user->defaultWorkspace(),
                $this->userPlannedMealStoreRequestData
            );

            $response = $this->actingAs($this->user)
                ->delete(
                    route('planned-meals.destroy'),
                    PlannedMealDestroyRequestData::from([
                        'planned_meals' => collect($plannedMeals)
                            ->pluck('id')
                            ->flatten()
                            ->all(),
                    ])->transform()
                )
                ->assertSessionHas('success', PlannedMealUnplannedMessage::message());
        });
    });
});
