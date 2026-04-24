<?php

use App\Actions\Recipes\RecipeSyncIngredientsAction;

use function Pest\Laravel\assertDatabaseHas;

describe('', function () {
    beforeEach(function () {
        /** @var \Tests\TestCase $this */
        $this->createRecipeContext();
        $this->recipe = $this->user->recipes()->create($this->recipeStoreRequestData->transform());
    });

    test('has many ingredients', function () {
        /** @var \Tests\TestCase $this */
        app(RecipeSyncIngredientsAction::class)($this->recipe, $this->recipeStoreRequestData->ingredients);

        foreach ($this->recipeStoreRequestData->ingredients as $ingredientData) {
            assertDatabaseHas('ingredients', $ingredientData->only('name')->transform());
            assertDatabaseHas('recipe_ingredient', [
                'recipe_id' => $this->recipe->id,
                ...$ingredientData->except('name', 'id')->transform(),
            ]);
        }
    });
});
