<?php

namespace Tests\Integration\Actions\Recipes;

use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    /** @var \Tests\TestCase $this */
    $this->setUpUploadedRecipeImageContext();
});

describe('RecipeUploadImageAction', function () {
    test('can upload an image', function () {
        /** @var \Tests\TestCase $this */
        expect($this->recipe->image_path)->toBe($this->recipeImagePath);
        Storage::disk('recipe_images')->assertExists($this->recipeImagePath);
    });
});
