<?php

use App\Actions\Recipes\RecipeSyncIngredientsAction;

use function Pest\Laravel\assertDatabaseHas;

beforeEach(function () {
    /** @var \Tests\TestCase $this */
    $this->setUpRecipeContext();
});

describe('RecipeIngredientsSyncAction', function () {
    test('can sync ingredients', function () {
        /** @var \Tests\TestCase $this */
        app(RecipeSyncIngredientsAction::class)($this->recipe, $this->otherRecipeStoreRequestData->ingredients);

        foreach ($this->otherRecipeStoreRequestData->ingredients as $ingredientData) {
            assertDatabaseHas('ingredients', $ingredientData->only('name')->transform());
            assertDatabaseHas('recipe_ingredient', [
                'recipe_id' => $this->recipe->id,
                ...$ingredientData->except('name', 'id')->transform(),
            ]);
        }
    });
});
