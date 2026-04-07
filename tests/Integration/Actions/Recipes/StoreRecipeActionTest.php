<?php

namespace Tests\Integration\Actions\Recipes;

use App\Actions\Recipes\StoreRecipeAction;
use App\Models\Recipe;
use App\Models\User;

use function Pest\Laravel\assertDatabaseHas;

describe('StoreRecipeAction', function () {
    beforeEach(function () {
        /** @var \Tests\TestCase $this */
        $this->createRecipeContext();
        $this->recipe = app(StoreRecipeAction::class)->execute(
            $this->user,
            $this->storeRecipeRequestData
        );
    });

    test('belongs to user', function () {
        /** @var \Tests\TestCase $this */
        expect($this->recipe->user)->toBeInstanceOf(User::class)
            ->and($this->recipe->user?->id)->toBe($this->user->id)
            ->and($this->recipe->user_id)->toBe($this->user->id);
    });

    test('can store a recipe with all relationships', function () {
        /** @var \Tests\TestCase $this */
        expect($this->recipe)->toBeInstanceOf(Recipe::class);
        expect($this->recipe->id)->not->toBeNull();

        assertDatabaseHas('recipes', [
            'id' => $this->recipe->id,
            'user_id' => $this->user->id,
            'name' => $this->storeRecipeRequestData->name,
            'description' => $this->storeRecipeRequestData->description,
            'serving_size' => $this->storeRecipeRequestData->serving_size,
            'preparation_time' => $this->storeRecipeRequestData->preparation_time,
            'cooking_time' => $this->storeRecipeRequestData->cooking_time,
        ]);

        expect($this->recipe->ingredients)->toHaveCount(count($this->storeRecipeRequestData->ingredients));
        expect($this->recipe->tags)->toHaveCount(count($this->storeRecipeRequestData->tags));
        expect($this->recipe->steps)->toHaveCount(count($this->storeRecipeRequestData->steps));
        expect($this->recipe->mealTimes)->toHaveCount(count($this->storeRecipeRequestData->meal_times));
    });

});
