<?php

namespace Tests\Integration\Actions\Recipes;

use App\Actions\Recipes\RecipeUploadImageAction;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

describe('RecipeUploadImageAction', function () {
    beforeEach(function () {
        /** @var \Tests\TestCase $this */
        $this->createRecipeContext();
        $this->recipe = $this->user->recipes()->create($this->recipeStoreRequestData->transform());
    });

    test('has an image', function () {
        /** @var \Tests\TestCase $this */
        $image = UploadedFile::fake()->image('recipe.jpg', 800, 600);
        Storage::fake('recipe_images');
        $image_path = (app(RecipeUploadImageAction::class))($this->recipe, $image);
        expect($this->recipe->image_path)->toBe($image_path);
        Storage::disk('recipe_images')->assertExists($image_path);
    });

});
