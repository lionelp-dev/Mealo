<?php

namespace Tests\Integration\Actions\Recipes;

use App\Actions\Recipes\SyncRecipeTagsAction;

use function Pest\Laravel\assertDatabaseHas;

describe('SyncRecipeTagsAction', function () {
    beforeEach(function () {
        /** @var \Tests\TestCase $this */
        $this->createRecipeContext();
        $this->recipe = $this->user->recipes()->create($this->storeRecipeRequestData->transform());
    });

    test('has many tags', function () {
        /** @var \Tests\TestCase $this */
        app(SyncRecipeTagsAction::class)($this->recipe, $this->storeRecipeRequestData->tags);

        foreach ($this->storeRecipeRequestData->tags as $tag) {
            assertDatabaseHas('tags', $tag->transform());
        }
    });

});
