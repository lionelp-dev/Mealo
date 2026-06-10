<?php

namespace Tests\Integration\Actions\Recipes;

use App\Actions\Recipes\RecipeSyncStepsAction;

use function Pest\Laravel\assertDatabaseHas;

describe('RecipeStepsSyncAction', function () {
    test('can sync steps', function () {
        /** @var \Tests\TestCase $this */
        app(RecipeSyncStepsAction::class)($this->recipe, $this->recipeStoreRequestData->steps);

        foreach ($this->recipeStoreRequestData->steps as $step) {
            assertDatabaseHas('steps', $step->transform());
        }
    });
});
