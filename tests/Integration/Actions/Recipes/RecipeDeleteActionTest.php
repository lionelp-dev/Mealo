<?php

namespace Tests\Integration\Actions\Recipes;

use App\Actions\Recipes\RecipeDestroyAction;
use App\Actions\Recipes\RecipeUploadImageAction;
use App\Data\Requests\Recipe\RecipeDestroyRequestData;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

use function Pest\Laravel\assertDatabaseMissing;

describe('RecipeDeleteAction', function () {
    beforeEach(function () {
        /** @var \Tests\TestCase $this */
        $this->createRecipeContext();
        $this->recipe = $this->user->recipes()->create($this->recipeStoreRequestData->transform());
    });

    test('can delete a recipe', function () {
        /** @var \Tests\TestCase $this */
        app(RecipeDestroyAction::class)->execute($this->user, RecipeDestroyRequestData::from(['ids' => [$this->recipe->id]]));
        assertDatabaseMissing('recipes', ['id' => $this->recipe->id]);
    });

    test('deleting recipe removes associated image', function () {
        /** @var \Tests\TestCase $this */
        $image = UploadedFile::fake()->image('recipe.jpg', 800, 600);
        Storage::fake('recipe_images');
        $imagePath = (app(RecipeUploadImageAction::class))($this->recipe, $image);

        app(RecipeDestroyAction::class)->execute($this->user, RecipeDestroyRequestData::from(['ids' => [$this->recipe->id]]));
        Storage::disk('recipe_images')->assertMissing($imagePath);
    });

});
