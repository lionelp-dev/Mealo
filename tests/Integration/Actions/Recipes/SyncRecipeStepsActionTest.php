<?php

namespace Tests\Integration\Actions\Recipes;

use App\Actions\Recipes\SyncRecipeStepsAction;

use function Pest\Laravel\assertDatabaseHas;

describe('SyncRecipeStepsAction', function () {
    beforeEach(function () {
        /** @var \Tests\TestCase $this */
        $this->createUserContext();
        $this->createRecipeContext();
        $this->recipe = $this->user->recipes()->create($this->storeRecipeRequestData->transform());
    });

    test('has many steps', function () {
        /** @var \Tests\TestCase $this */
        app(SyncRecipeStepsAction::class)($this->recipe, $this->storeRecipeRequestData->steps);

        foreach ($this->storeRecipeRequestData->steps as $step) {
            assertDatabaseHas('steps', $step->transform());
        }
    });
});
