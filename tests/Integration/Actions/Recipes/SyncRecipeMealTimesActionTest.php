<?php

namespace Tests\Integration\Actions\Recipes;

use App\Actions\Recipes\SyncRecipeMealTimesAction;

use function Pest\Laravel\assertDatabaseHas;

describe('SyncRecipeMealTimesAction', function () {
    beforeEach(function () {
        /** @var \Tests\TestCase $this */
        $this->createRecipeContext();
        $this->recipe = $this->user->recipes()->create($this->storeRecipeRequestData->transform());
    });

    test('has many meal times', function () {
        /** @var \Tests\TestCase $this */
        app(SyncRecipeMealTimesAction::class)($this->recipe, $this->storeRecipeRequestData->meal_times);

        foreach ($this->storeRecipeRequestData->meal_times as $mealTime) {
            assertDatabaseHas('meal_times', $mealTime->transform());
        }
    });
});
