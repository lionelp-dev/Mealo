<?php

namespace Tests\Integration\Actions\Recipes;

use App\Actions\Recipes\DeleteRecipeImageAction;
use App\Actions\Recipes\UploadRecipeImageAction;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

describe('DeleteRecipeImageActionTest', function () {
    beforeEach(function () {
        /** @var \Tests\TestCase $this */
        $this->createUserContext();
        $this->createRecipeContext();
        $this->recipe = $this->user->recipes()->create($this->storeRecipeRequestData->transform());
    });

    test('can delete recipe image', function () {
        /** @var \Tests\TestCase $this */
        $image = UploadedFile::fake()->image('recipe.jpg', 800, 600);
        Storage::fake('recipe_images');
        $imagePath = (app(UploadRecipeImageAction::class))($this->recipe, $image);

        expect($this->recipe->image_path)->toBe($imagePath);
        Storage::disk('recipe_images')->assertExists($imagePath);

        (app(DeleteRecipeImageAction::class))($this->recipe);
        Storage::disk('recipe_images')->assertMissing($imagePath);
        expect($this->recipe->image_path)->toBe(null);
    });

});
