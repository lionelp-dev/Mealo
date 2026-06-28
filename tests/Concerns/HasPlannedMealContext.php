<?php

namespace Tests\Concerns;

use App\Data\Requests\PlannedMeal\Entities\PlannedMealRequestData;
use App\Data\Requests\PlannedMeal\PlannedMealStoreRequestData;
use App\Data\Requests\PlannedMeal\PlannedMealUpdateRequestData;
use App\Models\MealTime;
use Symfony\Component\Uid\UuidV7 as SymfonyUuidV7;

trait HasPlannedMealContext
{
    public MealTime $mealTime;

    public PlannedMealRequestData $userPlannedMealRequestData;
    public PlannedMealRequestData $userSecondPlannedMealRequestData;
    public PlannedMealRequestData $editorPlannedMealRequestData;
    public PlannedMealRequestData $viewerPlannedMealRequestData;
    public PlannedMealRequestData $otherUserPlannedMealRequestData;

    public PlannedMealStoreRequestData $userPlannedMealStoreRequestData;
    public PlannedMealStoreRequestData $userMultiplePlannedMealStoreRequestData;
    public PlannedMealStoreRequestData $userDuplicatePlannedMealStoreRequestData;
    public PlannedMealStoreRequestData $userInvalidPlannedMealStoreRequestData;
    public PlannedMealStoreRequestData $editorPlannedMealStoreRequestData;
    public PlannedMealStoreRequestData $viewerPlannedMealStoreRequestData;
    public PlannedMealStoreRequestData $otherUserPlannedMealStoreRequestData;

    public PlannedMealUpdateRequestData $userPlannedMealUpdateRequestData;
    public PlannedMealUpdateRequestData $viewerPlannedMealUpdateRequestData;

    public function setUpHasPlannedMealContext(): void
    {
        $this->mealTime = MealTime::firstOrFail();

        $this->userPlannedMealRequestData = PlannedMealRequestData::from([
            'meal_time_id' => $this->mealTime->id,
            'recipe_id' => $this->recipe->id,
            'planned_date' => now()->addDay()->format('Y-m-d'),
            'serving_size' => 1,
        ]);

        $this->userSecondPlannedMealRequestData = PlannedMealRequestData::from([
            'meal_time_id' => $this->mealTime->id,
            'recipe_id' => $this->otherRecipe->id,
            'planned_date' => now()->addDay()->format('Y-m-d'),
            'serving_size' => 1,
        ]);

        $this->userPlannedMealStoreRequestData = PlannedMealStoreRequestData::from([
            'planned_meals' => [
                PlannedMealRequestData::from($this->userPlannedMealRequestData)->toArray(),
            ],
        ]);

        $this->userPlannedMealUpdateRequestData = PlannedMealUpdateRequestData::from([
            'meal_time_id' => $this->mealTime->id,
            'recipe_id' => $this->recipe->id,
            'planned_date' => now()->addDays(2)->format('Y-m-d'),
            'serving_size' => 2,
        ]);

        $this->userMultiplePlannedMealStoreRequestData = PlannedMealStoreRequestData::from([
            'planned_meals' => [
                PlannedMealRequestData::from($this->userPlannedMealRequestData)->toArray(),
                PlannedMealRequestData::from($this->userSecondPlannedMealRequestData)->toArray(),
            ],
        ]);

        $this->userDuplicatePlannedMealStoreRequestData = PlannedMealStoreRequestData::from([
            'planned_meals' => [
                PlannedMealRequestData::from($this->userPlannedMealRequestData)->toArray(),
                PlannedMealRequestData::from($this->userPlannedMealRequestData)->toArray(),
            ],
        ]);

        $this->userInvalidPlannedMealRequestData = PlannedMealRequestData::from([
            'meal_time_id' => 999999999,
            'recipe_id' => new SymfonyUuidV7()->v7(),
            'planned_date' => '',
            'serving_size' => 1,
        ]);

        $this->userInvalidPlannedMealStoreRequestData = PlannedMealStoreRequestData::from([
            'planned_meals' => [
                PlannedMealRequestData::from($this->userInvalidPlannedMealRequestData)->toArray(),
            ],
        ]);

        $this->editorPlannedMealRequestData = PlannedMealRequestData::from([
            'meal_time_id' => $this->mealTime->id,
            'recipe_id' => $this->editorRecipe->id,
            'planned_date' => now()->addDay()->format('Y-m-d'),
            'serving_size' => 1,
        ]);

        $this->editorPlannedMealStoreRequestData = PlannedMealStoreRequestData::from([
            'planned_meals' => [
                PlannedMealRequestData::from($this->editorPlannedMealRequestData)->toArray(),
            ],
        ]);

        $this->viewerPlannedMealRequestData = PlannedMealRequestData::from([
            'meal_time_id' => $this->mealTime->id,
            'recipe_id' => $this->viewerRecipe->id,
            'planned_date' => now()->addDay()->format('Y-m-d'),
            'serving_size' => 1,
        ]);

        $this->viewerPlannedMealStoreRequestData = PlannedMealStoreRequestData::from([
            'planned_meals' => [
                PlannedMealRequestData::from($this->viewerPlannedMealRequestData)->toArray(),
            ],
        ]);

        $this->viewerPlannedMealUpdateRequestData = PlannedMealUpdateRequestData::from([
            'meal_time_id' => $this->mealTime->id,
            'recipe_id' => $this->recipe->id,
            'planned_date' => now()->addDays(2)->format('Y-m-d'),
            'serving_size' => 2,
        ]);

        $this->otherUserPlannedMealRequestData = PlannedMealRequestData::from([
            'meal_time_id' => $this->mealTime->id,
            'recipe_id' => $this->otherUserRecipe->id,
            'planned_date' => now()->addDay()->format('Y-m-d'),
            'serving_size' => 1,
        ]);

        $this->otherUserPlannedMealStoreRequestData = PlannedMealStoreRequestData::from([
            'planned_meals' => [
                PlannedMealRequestData::from($this->otherUserPlannedMealRequestData)->toArray(),
            ],
        ]);
    }
}
