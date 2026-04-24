<?php

namespace Tests\Integration\Actions\Recipes;

use App\Actions\Recipes\RecipeImageDeleteAction;
use App\Actions\Recipes\RecipeUploadImageAction;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

describe('RecipeImageDeleteAction', function () {
    beforeEach(function () {
        /** @var \Tests\TestCase $this */
        $this->createRecipeContext();
        $this->recipe = $this->user->recipes()->create($this->recipeStoreRequestData->transform());
    });

    test('can delete recipe image', function () {
        /** @var \Tests\TestCase $this */
        $image = UploadedFile::fake()->image('recipe.jpg', 800, 600);
        Storage::fake('recipe_images');
        $imagePath = (app(RecipeUploadImageAction::class))($this->recipe, $image);

        expect($this->recipe->image_path)->toBe($imagePath);
        Storage::disk('recipe_images')->assertExists($imagePath);

        (app(RecipeImageDeleteAction::class))($this->recipe);
        Storage::disk('recipe_images')->assertMissing($imagePath);
        expect($this->recipe->image_path)->toBe(null);
    });

});
