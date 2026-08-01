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

    public PlannedMealRequestData $userInvalidPlannedMealRequestData;

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
        if (isset($this->mealTime)) {
            return;
        }

        $this->mealTime = MealTime::firstOrFail();
    }

    public function setUpUserPlannedMealRequestDataContext(): void
    {
        if (isset($this->userPlannedMealRequestData)) {
            return;
        }

        $this->setUpRecipeContext();

        $this->userPlannedMealRequestData = PlannedMealRequestData::from([
            'meal_time_id' => $this->mealTime->id,
            'recipe_id' => $this->recipe->id,
            'planned_date' => now()->addDay()->format('Y-m-d'),
            'serving_size' => 1,
        ]);
    }

    public function setUpUserSecondPlannedMealRequestDataContext(): void
    {
        if (isset($this->userSecondPlannedMealRequestData)) {
            return;
        }

        $this->setUpOtherRecipeContext();

        $this->userSecondPlannedMealRequestData = PlannedMealRequestData::from([
            'meal_time_id' => $this->mealTime->id,
            'recipe_id' => $this->otherRecipe->id,
            'planned_date' => now()->addDay()->format('Y-m-d'),
            'serving_size' => 1,
        ]);
    }

    public function setUpUserInvalidPlannedMealRequestDataContext(): void
    {
        if (isset($this->userInvalidPlannedMealRequestData)) {
            return;
        }

        $this->userInvalidPlannedMealRequestData = PlannedMealRequestData::from([
            'meal_time_id' => 999999999,
            'recipe_id' => new SymfonyUuidV7()->v7(),
            'planned_date' => '',
            'serving_size' => 1,
        ]);
    }

    public function setUpEditorPlannedMealRequestDataContext(): void
    {
        if (isset($this->editorPlannedMealRequestData)) {
            return;
        }

        $this->setUpEditorRecipeContext();

        $this->editorPlannedMealRequestData = PlannedMealRequestData::from([
            'meal_time_id' => $this->mealTime->id,
            'recipe_id' => $this->editorRecipe->id,
            'planned_date' => now()->addDay()->format('Y-m-d'),
            'serving_size' => 1,
        ]);
    }

    public function setUpViewerPlannedMealRequestDataContext(): void
    {
        if (isset($this->viewerPlannedMealRequestData)) {
            return;
        }

        $this->setUpViewerRecipeContext();

        $this->viewerPlannedMealRequestData = PlannedMealRequestData::from([
            'meal_time_id' => $this->mealTime->id,
            'recipe_id' => $this->viewerRecipe->id,
            'planned_date' => now()->addDay()->format('Y-m-d'),
            'serving_size' => 1,
        ]);
    }

    public function setUpOtherUserPlannedMealRequestDataContext(): void
    {
        if (isset($this->otherUserPlannedMealRequestData)) {
            return;
        }

        $this->setUpOtherUserRecipeContext();

        $this->otherUserPlannedMealRequestData = PlannedMealRequestData::from([
            'meal_time_id' => $this->mealTime->id,
            'recipe_id' => $this->otherUserRecipe->id,
            'planned_date' => now()->addDay()->format('Y-m-d'),
            'serving_size' => 1,
        ]);
    }

    public function setUpUserPlannedMealStoreRequestDataContext(): void
    {
        if (isset($this->userPlannedMealStoreRequestData)) {
            return;
        }

        $this->setUpUserPlannedMealRequestDataContext();

        $this->userPlannedMealStoreRequestData = PlannedMealStoreRequestData::from([
            'planned_meals' => [
                PlannedMealRequestData::from($this->userPlannedMealRequestData)->toArray(),
            ],
        ]);
    }

    public function setUpUserMultiplePlannedMealStoreRequestDataContext(): void
    {
        if (isset($this->userMultiplePlannedMealStoreRequestData)) {
            return;
        }

        $this->setUpUserPlannedMealRequestDataContext();
        $this->setUpUserSecondPlannedMealRequestDataContext();

        $this->userMultiplePlannedMealStoreRequestData = PlannedMealStoreRequestData::from([
            'planned_meals' => [
                PlannedMealRequestData::from($this->userPlannedMealRequestData)->toArray(),
                PlannedMealRequestData::from($this->userSecondPlannedMealRequestData)->toArray(),
            ],
        ]);
    }

    public function setUpUserDuplicatePlannedMealStoreRequestDataContext(): void
    {
        if (isset($this->userDuplicatePlannedMealStoreRequestData)) {
            return;
        }

        $this->setUpUserPlannedMealRequestDataContext();

        $this->userDuplicatePlannedMealStoreRequestData = PlannedMealStoreRequestData::from([
            'planned_meals' => [
                PlannedMealRequestData::from($this->userPlannedMealRequestData)->toArray(),
                PlannedMealRequestData::from($this->userPlannedMealRequestData)->toArray(),
            ],
        ]);
    }

    public function setUpUserInvalidPlannedMealStoreRequestDataContext(): void
    {
        if (isset($this->userInvalidPlannedMealStoreRequestData)) {
            return;
        }

        $this->setUpUserInvalidPlannedMealRequestDataContext();

        $this->userInvalidPlannedMealStoreRequestData = PlannedMealStoreRequestData::from([
            'planned_meals' => [
                PlannedMealRequestData::from($this->userInvalidPlannedMealRequestData)->toArray(),
            ],
        ]);
    }

    public function setUpEditorPlannedMealStoreRequestDataContext(): void
    {
        if (isset($this->editorPlannedMealStoreRequestData)) {
            return;
        }

        $this->setUpEditorPlannedMealRequestDataContext();

        $this->editorPlannedMealStoreRequestData = PlannedMealStoreRequestData::from([
            'planned_meals' => [
                PlannedMealRequestData::from($this->editorPlannedMealRequestData)->toArray(),
            ],
        ]);
    }

    public function setUpViewerPlannedMealStoreRequestDataContext(): void
    {
        if (isset($this->viewerPlannedMealStoreRequestData)) {
            return;
        }

        $this->setUpViewerPlannedMealRequestDataContext();

        $this->viewerPlannedMealStoreRequestData = PlannedMealStoreRequestData::from([
            'planned_meals' => [
                PlannedMealRequestData::from($this->viewerPlannedMealRequestData)->toArray(),
            ],
        ]);
    }

    public function setUpOtherUserPlannedMealStoreRequestDataContext(): void
    {
        if (isset($this->otherUserPlannedMealStoreRequestData)) {
            return;
        }

        $this->setUpOtherUserPlannedMealRequestDataContext();

        $this->otherUserPlannedMealStoreRequestData = PlannedMealStoreRequestData::from([
            'planned_meals' => [
                PlannedMealRequestData::from($this->otherUserPlannedMealRequestData)->toArray(),
            ],
        ]);
    }

    public function setUpUserPlannedMealUpdateRequestDataContext(): void
    {
        if (isset($this->userPlannedMealUpdateRequestData)) {
            return;
        }

        $this->setUpRecipeContext();

        $this->userPlannedMealUpdateRequestData = PlannedMealUpdateRequestData::from([
            'meal_time_id' => $this->mealTime->id,
            'recipe_id' => $this->recipe->id,
            'planned_date' => now()->addDays(2)->format('Y-m-d'),
            'serving_size' => 2,
        ]);
    }

    public function setUpViewerPlannedMealUpdateRequestDataContext(): void
    {
        if (isset($this->viewerPlannedMealUpdateRequestData)) {
            return;
        }

        $this->setUpRecipeContext();

        $this->viewerPlannedMealUpdateRequestData = PlannedMealUpdateRequestData::from([
            'meal_time_id' => $this->mealTime->id,
            'recipe_id' => $this->recipe->id,
            'planned_date' => now()->addDays(2)->format('Y-m-d'),
            'serving_size' => 2,
        ]);
    }
}
