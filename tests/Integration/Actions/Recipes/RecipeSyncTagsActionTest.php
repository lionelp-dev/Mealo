<?php

namespace Tests\Integration\Actions\Recipes;

use App\Actions\Recipes\RecipeSyncTagsAction;

use function Pest\Laravel\assertDatabaseHas;

beforeEach(function () {
    /** @var \Tests\TestCase $this */
    $this->setUpRecipeContext();
});

describe('RecipeTagsSyncAction', function () {
    test('can sync tags', function () {
        /** @var \Tests\TestCase $this */
        app(RecipeSyncTagsAction::class)($this->recipe, $this->recipeStoreRequestData->tags);

        foreach ($this->recipeStoreRequestData->tags as $tag) {
            assertDatabaseHas('tags', $tag->transform());
        }
    });

});
