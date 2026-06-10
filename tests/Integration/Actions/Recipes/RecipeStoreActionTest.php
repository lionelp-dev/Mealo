<?php

namespace Tests\Integration\Actions\Recipes;

use App\Actions\Recipes\RecipeStoreAction;
use function Pest\Laravel\assertDatabaseHas;

describe('RecipeStoreAction', function () {
    test('can store a recipe with all relationships', function () {
        /** @var \Tests\TestCase $this */
        app(RecipeStoreAction::class)->execute($this->user, $this->recipeStoreRequestData);

        assertDatabaseHas('recipes', [
            'id' => $this->recipe->id,
            'user_id' => $this->user->id,
            ...$this->recipeStoreRequestData->except('meal_times', 'ingredients', 'tags', 'steps', 'image')->transform(),
        ]);

        expect($this->recipe->ingredients)->toHaveCount(count($this->recipeStoreRequestData->ingredients));
        expect($this->recipe->tags)->toHaveCount(count($this->recipeStoreRequestData->tags));
        expect($this->recipe->steps)->toHaveCount(count($this->recipeStoreRequestData->steps));
        expect($this->recipe->mealTimes)->toHaveCount(count($this->recipeStoreRequestData->meal_times));
    });
});
