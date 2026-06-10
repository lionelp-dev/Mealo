<?php

namespace Tests\Integration\Actions\Recipes;

use App\Actions\Recipes\RecipeImageDeleteAction;
use Illuminate\Support\Facades\Storage;

describe('RecipeImageDeleteAction', function () {
    test('can delete recipe image', function () {
        /** @var \Tests\TestCase $this */
        expect($this->recipe->image_path)->toBe($this->recipeImagePath);
        Storage::disk('recipe_images')->assertExists($this->recipeImagePath);

        (app(RecipeImageDeleteAction::class))($this->recipe);
        Storage::disk('recipe_images')->assertMissing($this->recipeImagePath);
        expect($this->recipe->image_path)->toBe(null);
    });
});
