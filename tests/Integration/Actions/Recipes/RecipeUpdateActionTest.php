<?php

namespace Tests\Integration\Actions\Recipes;

use App\Actions\Recipes\RecipeStoreAction;
use App\Actions\Recipes\RecipeUpdateAction;

use function Pest\Laravel\assertDatabaseHas;

describe('RecipeUpdateAction', function () {
    beforeEach(function () {
        /** @var \Tests\TestCase $this */
        $this->createRecipeContext();

        $this->recipe = app(RecipeStoreAction::class)->execute($this->user, $this->recipeStoreRequestData);
        $this->otherRecipe = app(RecipeStoreAction::class)->execute($this->user, $this->otherRecipeStoreRequestData);

        $this->recipeUpdateRequestData = $this->makeUpdateRecipeRequestDataFor($this->user);
    });

    test('can update a recipe', function () {
        /** @var \Tests\TestCase $this */
        app(RecipeUpdateAction::class)->execute($this->recipe, $this->recipeUpdateRequestData);

        $this->recipe->refresh();

        assertDatabaseHas('recipes', [
            'id' => $this->recipe->id,
            'user_id' => $this->user->id,
            ...$this->recipeUpdateRequestData->except('meal_times', 'ingredients', 'tags', 'steps', 'image')->transform(),
        ]);

        expect($this->recipe->mealTimes)->toHaveCount(count($this->recipeUpdateRequestData->meal_times));
        expect($this->recipe->ingredients)->toHaveCount(count($this->recipeUpdateRequestData->ingredients));
        expect($this->recipe->tags)->toHaveCount(count($this->recipeUpdateRequestData->tags));
        expect($this->recipe->steps)->toHaveCount(count($this->recipeUpdateRequestData->steps));
    });

});
