<?php

namespace Tests\Feature\Recipe;

use App\Actions\Recipes\RecipeStoreAction;
use App\Messages\Recipe\RecipeGenerationFailedMessage;
use RuntimeException;

describe('RecipeDiscoverySave', function () {
    test('redirects back to the recipe page when saving a discovery fails', function () {
        /** @var \Tests\TestCase $this */
        $this->mock(RecipeStoreAction::class)
            ->shouldReceive('execute')
            ->once()
            ->andThrow(new RuntimeException('Storage failed.'));

        $this->actingAs($this->user)
            ->from(route('recipes.index'))
            ->post(route('recipes.discover.save'), $this->recipeStoreRequestData->transform())
            ->assertRedirect(route('recipes.index'))
            ->assertSessionHas('error', RecipeGenerationFailedMessage::message());
    });
});
