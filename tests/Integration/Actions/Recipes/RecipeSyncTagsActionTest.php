<?php

namespace Tests\Integration\Actions\Recipes;

use App\Actions\Recipes\RecipeSyncTagsAction;

use function Pest\Laravel\assertDatabaseHas;

describe('SyncRecipeTagsAction', function () {
    beforeEach(function () {
        /** @var \Tests\TestCase $this */
        $this->createRecipeContext();
        $this->recipe = $this->user->recipes()->create($this->recipeStoreRequestData->transform());
    });

    test('has many tags', function () {
        /** @var \Tests\TestCase $this */
        app(RecipeSyncTagsAction::class)($this->recipe, $this->recipeStoreRequestData->tags);

        foreach ($this->recipeStoreRequestData->tags as $tag) {
            assertDatabaseHas('tags', $tag->transform());
        }
    });

});
