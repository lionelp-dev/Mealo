<?php

use App\Actions\Recipes\SyncRecipeIngredientsAction;

use function Pest\Laravel\assertDatabaseHas;

describe('', function () {
    beforeEach(function () {
        /** @var \Tests\TestCase $this */
        $this->createRecipeContext();
        $this->recipe = $this->user->recipes()->create($this->storeRecipeRequestData->transform());
    });

    test('has many ingredients', function () {
        /** @var \Tests\TestCase $this */
        app(SyncRecipeIngredientsAction::class)($this->recipe, $this->storeRecipeRequestData->ingredients);

        foreach ($this->storeRecipeRequestData->ingredients as $ingredientData) {
            assertDatabaseHas('ingredients', $ingredientData->only('name')->transform());
            assertDatabaseHas('recipe_ingredient', [
                'recipe_id' => $this->recipe->id,
                ...$ingredientData->except('name', 'id')->transform(),
            ]);
        }
    });
});
