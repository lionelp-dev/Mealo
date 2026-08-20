<?php

namespace Tests\Integration\Actions\Recipes;

use App\Actions\Recipes\RecipeStoreAction;
use App\Data\Requests\Recipe\RecipeAIGeneratedStoreRequestData;
use Illuminate\Support\Facades\Storage;

use function Pest\Laravel\assertDatabaseHas;

beforeEach(function () {
    /** @var \Tests\TestCase $this */
    $this->setUpRecipeContext();
});

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
        expect($this->recipe->tags)->toHaveCount(collect($this->recipeStoreRequestData->tags)->pluck('name')->unique()->count());
        expect($this->recipe->steps)->toHaveCount(count($this->recipeStoreRequestData->steps));
        expect($this->recipe->mealTimes)->toHaveCount(count($this->recipeStoreRequestData->meal_times));
    });

    test('can store a recipe with a generated image', function () {
        /** @var \Tests\TestCase $this */
        $this->setUpRecipeImageContext();

        $recipe = app(RecipeStoreAction::class)->execute(
            $this->user,
            RecipeAIGeneratedStoreRequestData::from([
                ...$this->recipeStoreRequestData->except('image')->transform(),
                'image_data_url' => 'data:image/png;base64,'.base64_encode('generated image contents'),
            ]),
        );

        expect($recipe->image_path)->not->toBeNull()
            ->and($recipe->image_path)->toContain('_generated_');

        Storage::disk('recipe_images')->assertExists($recipe->image_path ?? '');
    });

    test('uploaded image takes priority over generated image', function () {
        /** @var \Tests\TestCase $this */
        $this->setUpRecipeImageContext();

        $recipeData = RecipeAIGeneratedStoreRequestData::from([
            ...$this->recipeStoreRequestData->except('image')->transform(),
            'image' => $this->recipeImage,
            'image_data_url' => 'data:image/png;base64,'.base64_encode('generated image contents'),
        ]);

        $recipe = app(RecipeStoreAction::class)->execute(
            $this->user,
            $recipeData,
        );

        expect($recipe->image_path)->not->toBeNull()
            ->and($recipe->image_path)->not->toContain('_generated_');

        Storage::disk('recipe_images')->assertExists($recipe->image_path ?? '');
    });
});
