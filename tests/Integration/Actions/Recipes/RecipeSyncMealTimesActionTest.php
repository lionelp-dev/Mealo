<?php

namespace Tests\Integration\Actions\Recipes;

use App\Actions\Recipes\RecipeSyncMealTimesAction;

use function Pest\Laravel\assertDatabaseHas;

describe('SyncRecipeMealTimesAction', function () {
    beforeEach(function () {
        /** @var \Tests\TestCase $this */
        $this->createRecipeContext();
        $this->recipe = $this->user->recipes()->create($this->recipeStoreRequestData->transform());
    });

    test('has many meal times', function () {
        /** @var \Tests\TestCase $this */
        app(RecipeSyncMealTimesAction::class)($this->recipe, $this->recipeStoreRequestData->meal_times);

        foreach ($this->recipeStoreRequestData->meal_times as $mealTime) {
            assertDatabaseHas('meal_times', $mealTime->transform());
        }
    });
});
