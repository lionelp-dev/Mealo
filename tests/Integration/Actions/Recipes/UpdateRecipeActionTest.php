<?php

namespace Tests\Integration\Actions\Recipes;

use App\Actions\Recipes\StoreRecipeAction;
use App\Actions\Recipes\UpdateRecipeAction;

use function Pest\Laravel\assertDatabaseHas;

describe('UpdateRecipeAction', function () {
    beforeEach(function () {
        /** @var \Tests\TestCase $this */
        $this->createUserContext();
        $this->createRecipeContext();

        $this->recipe = app(StoreRecipeAction::class)->execute($this->user, $this->storeRecipeRequestData);
        $this->otherRecipe = app(StoreRecipeAction::class)->execute($this->user, $this->otherStoreRecipeRequestData);

        $this->updateRecipeRequestData = $this->makeUpdateRecipeRequestDataFor($this->user);
    });

    test('can update a recipe', function () {
        /** @var \Tests\TestCase $this */
        app(UpdateRecipeAction::class)->execute($this->recipe, $this->updateRecipeRequestData);

        $this->recipe->refresh();

        assertDatabaseHas('recipes', [
            'id' => $this->recipe->id,
            'user_id' => $this->user->id,
            ...$this->updateRecipeRequestData->except('meal_times', 'ingredients', 'tags', 'steps', 'image')->transform(),
        ]);

        expect($this->recipe->mealTimes)->toHaveCount(count($this->updateRecipeRequestData->meal_times));
        expect($this->recipe->ingredients)->toHaveCount(count($this->updateRecipeRequestData->ingredients));
        expect($this->recipe->tags)->toHaveCount(count($this->updateRecipeRequestData->tags));
        expect($this->recipe->steps)->toHaveCount(count($this->updateRecipeRequestData->steps));
    });

});
