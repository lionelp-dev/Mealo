<?php

namespace Tests\Integration\Actions\Recipes;

use App\Actions\Recipes\RecipeDestroyAction;
use App\Data\Requests\Recipe\RecipeDestroyRequestData;
use Illuminate\Support\Facades\Storage;

use function Pest\Laravel\assertDatabaseMissing;

beforeEach(function () {
    /** @var \Tests\TestCase $this */
    $this->setUpUploadedRecipeImageContext();
});

describe('RecipeDeleteAction', function () {
    test('can delete a recipe', function () {
        /** @var \Tests\TestCase $this */
        app(RecipeDestroyAction::class)->execute($this->user, RecipeDestroyRequestData::from(['ids' => [$this->recipe->id]]));
        assertDatabaseMissing('recipes', ['id' => $this->recipe->id]);
    });

    test('deleting recipe removes associated image', function () {
        /** @var \Tests\TestCase $this */
        app(RecipeDestroyAction::class)->execute($this->user, RecipeDestroyRequestData::from(['ids' => [$this->recipe->id]]));
        Storage::disk('recipe_images')->assertMissing($this->recipeImagePath);
    });
});
