<?php

namespace Tests\Integration\Actions\Recipes;

use App\Actions\Recipes\DeleteRecipesAction;
use App\Actions\Recipes\UploadRecipeImageAction;
use App\Data\Requests\Recipe\DeleteRecipesRequestData;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

use function Pest\Laravel\assertDatabaseMissing;

describe('DeleteRecipeActionTest', function () {
    beforeEach(function () {
        /** @var \Tests\TestCase $this */
        $this->createUserContext();
        $this->createRecipeContext();
        $this->recipe = $this->user->recipes()->create($this->storeRecipeRequestData->transform());
    });

    test('can delete a recipe', function () {
        /** @var \Tests\TestCase $this */
        app(DeleteRecipesAction::class)->execute($this->user, DeleteRecipesRequestData::from(['ids' => [$this->recipe->id]]));
        assertDatabaseMissing('recipes', ['id' => $this->recipe->id]);
    });

    test('deleting recipe removes associated image', function () {
        /** @var \Tests\TestCase $this */
        $image = UploadedFile::fake()->image('recipe.jpg', 800, 600);
        Storage::fake('recipe_images');
        $imagePath = (app(UploadRecipeImageAction::class))($this->recipe, $image);

        app(DeleteRecipesAction::class)->execute($this->user, DeleteRecipesRequestData::from(['ids' => [$this->recipe->id]]));
        Storage::disk('recipe_images')->assertMissing($imagePath);
    });

});
