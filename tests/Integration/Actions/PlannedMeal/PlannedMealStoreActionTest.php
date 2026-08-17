<?php

namespace Tests\Integration\Actions\PlannedMeal;

use App\Actions\PlannedMeal\PlannedMealStoreAction;
use App\Data\Requests\PlannedMeal\Entities\PlannedMealRequestData;
use App\Data\Requests\PlannedMeal\PlannedMealStoreRequestData;
use Carbon\Carbon;
use Illuminate\Auth\Access\AuthorizationException;
use Spatie\LaravelData\Exceptions\CannotCreateData;

use function Pest\Laravel\assertDatabaseHas;

beforeEach(function () {
    /** @var \Tests\TestCase $this */
    $this->setUpSharedWorkspaceContext();
    $this->setUpUserPlannedMealStoreRequestDataContext();
    $this->setUpViewerPlannedMealStoreRequestDataContext();
    $this->setUpOtherUserPlannedMealStoreRequestDataContext();
});

describe('PlannedMealStoreAction', function () {
    test('successfully stores a planned meal', function () {
        /** @var \Tests\TestCase $this */
        (app(PlannedMealStoreAction::class))->execute(
            $this->user,
            $this->user->defaultWorkspace(),
            $this->userPlannedMealStoreRequestData
        );

        $plannedMealData = $this->userPlannedMealRequestData->transform();

        assertDatabaseHas('planned_meals', [
            'workspace_id' => $this->user->defaultWorkspace()->id,
            'user_id' => $this->user->id,
            ...$plannedMealData,
            'planned_date' => Carbon::parse($plannedMealData['planned_date'])->toDateTimeString(),
        ]);
    });

    test('synchronizes the shopping list when storing a planned meal', function () {
        /** @var \Tests\TestCase $this */
        $plannedMeals = (app(PlannedMealStoreAction::class))->execute(
            $this->user,
            $this->user->defaultWorkspace(),
            $this->userPlannedMealStoreRequestData
        );

        $shoppingList = $this->findShoppingListForWorkspaceAndDate(
            $this->user->defaultWorkspace(),
            $plannedMeals[0]->planned_date,
        );

        expect($shoppingList->plannedMealIngredients)
            ->toHaveCount($this->recipe->ingredients()->count());
    });

    test('successfully stores planned meal using recipe from other workspace member', function () {
        /** @var \Tests\TestCase $this */
        (app(PlannedMealStoreAction::class))->execute(
            $this->user,
            $this->sharedWorkspace,
            $this->userPlannedMealStoreRequestData
        );

        (app(PlannedMealStoreAction::class))->execute(
            $this->editorUser,
            $this->sharedWorkspace,
            $this->userPlannedMealStoreRequestData
        );

        $plannedMealData = $this->userPlannedMealRequestData->transform();

        assertDatabaseHas('planned_meals', [
            'workspace_id' => $this->sharedWorkspace->id,
            'user_id' => $this->editorUser->id,
            ...$plannedMealData,
            'planned_date' => Carbon::parse($plannedMealData['planned_date'])->toDateTimeString(),
        ]);
    });

    test('merges serving sizes when storing duplicate planned meal', function () {
        /** @var \Tests\TestCase $this */
        (app(PlannedMealStoreAction::class))->execute(
            $this->user,
            $this->user->defaultWorkspace(),
            $this->userPlannedMealStoreRequestData
        );

        (app(PlannedMealStoreAction::class))->execute(
            $this->user,
            $this->user->defaultWorkspace(),
            $this->userPlannedMealStoreRequestData
        );

        $plannedMealData = $this->userPlannedMealRequestData->transform();

        assertDatabaseHas('planned_meals', [
            'workspace_id' => $this->user->defaultWorkspace()->id,
            'user_id' => $this->user->id,
            ...$plannedMealData,
            'planned_date' => Carbon::parse($plannedMealData['planned_date'])->toDateTimeString(),
            'serving_size' => 2,
        ]);
    });

    test('throws AuthorizationException when viewer attempts to plan a meal', function () {
        expect(function () {
            /** @var \Tests\TestCase $this */
            (app(PlannedMealStoreAction::class))->execute(
                $this->viewerUser,
                $this->sharedWorkspace,
                $this->viewerPlannedMealStoreRequestData
            );
        })->toThrow(AuthorizationException::class);
    });

    test('throws AuthorizationException when non-workspace user attempts to plan a meal', function () {
        expect(function () {
            /** @var \Tests\TestCase $this */
            (app(PlannedMealStoreAction::class))->execute(
                $this->otherUser,
                $this->sharedWorkspace,
                $this->otherUserPlannedMealStoreRequestData
            );
        })->toThrow(AuthorizationException::class);
    });

    test('throws CannotCreateData when planning meal with non-existent recipe', function () {
        /** @var \Tests\TestCase $this */
        $plannedMealData = $this->userPlannedMealStoreRequestData->planned_meals[0];

        expect(function () use ($plannedMealData) {
            (app(PlannedMealStoreAction::class))->execute(
                /** @var \Tests\TestCase $this */
                $this->user,
                $this->user->defaultWorkspace(),
                PlannedMealStoreRequestData::from(
                    [
                        'planned_meals' => [
                            PlannedMealRequestData::from(
                                recipe_id: 'non-existent-uuid',
                                meal_time_id: $plannedMealData->meal_time_id,
                                planned_date: $plannedMealData->planned_date,
                                serving_size: $plannedMealData->serving_size,
                            ),
                        ],
                    ]
                )
            );
        })->toThrow(CannotCreateData::class);
    });
});
