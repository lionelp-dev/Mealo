<?php

namespace Tests\Integration\Actions\Recipes;

use App\Actions\Recipes\RecipeSyncStepsAction;

use function Pest\Laravel\assertDatabaseHas;

describe('SyncRecipeStepsAction', function () {
    beforeEach(function () {
        /** @var \Tests\TestCase $this */
        $this->createRecipeContext();
        $this->recipe = $this->user->recipes()->create($this->recipeStoreRequestData->transform());
    });

    test('has many steps', function () {
        /** @var \Tests\TestCase $this */
        app(RecipeSyncStepsAction::class)($this->recipe, $this->recipeStoreRequestData->steps);

        foreach ($this->recipeStoreRequestData->steps as $step) {
            assertDatabaseHas('steps', $step->transform());
        }
    });
});
