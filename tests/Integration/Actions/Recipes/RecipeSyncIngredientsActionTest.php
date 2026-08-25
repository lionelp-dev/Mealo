<?php

use App\Actions\Recipes\RecipeSyncIngredientsAction;
use App\Data\Requests\Recipe\Entities\IngredientRequestData;
use App\Models\Ingredient;
use App\Models\IngredientCategory;

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
            assertDatabaseHas('ingredients', $ingredientData->only('name', 'category_id')->transform());
            assertDatabaseHas('recipe_ingredient', [
                'recipe_id' => $this->recipe->id,
                ...$ingredientData->except('name', 'id', 'category_id')->transform(),
            ]);
        }
    });

    test('can reclassify an existing ingredient while keeping name identity', function () {
        /** @var \Tests\TestCase $this */
        $firstCategory = IngredientCategory::query()->where('slug', 'autres')->firstOrFail();
        $secondCategory = IngredientCategory::query()->where('slug', 'fruits')->firstOrFail();

        $ingredient = Ingredient::factory()->create([
            'user_id' => $this->user->id,
            'name' => 'Tomate',
            'category_id' => $firstCategory->id,
        ]);

        app(RecipeSyncIngredientsAction::class)($this->recipe, [
            IngredientRequestData::from([
                'name' => $ingredient->name,
                'quantity' => 2,
                'unit' => 'piece',
                'category_id' => $secondCategory->id,
            ]),
        ]);

        expect($ingredient->fresh()->category_id)->toBe($secondCategory->id);
        expect(Ingredient::query()
            ->where('user_id', $this->user->id)
            ->where('name', 'Tomate')
            ->count())->toBe(1);
    });
});
