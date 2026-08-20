<?php

namespace App\Actions\Recipes;

use App\Data\Requests\Recipe\RecipeAIGenerationRequestData;
use App\Models\Recipe;
use App\Models\User;
use Illuminate\Support\Collection;

class RecipeAIGenerateAndStoreAction
{
    public function __construct(
        private readonly RecipeAIGenerationAction $recipeAIGenerationAction,
        private readonly RecipeStoreAction $recipeStoreAction,
    ) {}

    /**
     * Generate one or more recipes from the AI service and persist them.
     *
     * When image generation is requested, the AI service returns each image as a
     * base64 data URL alongside its recipe; it is passed straight to the store
     * action (which routes it through RecipeUploadImageAction::fromDataUrl).
     *
     * @return Collection<int, Recipe>
     */
    public function execute(User $user, RecipeAIGenerationRequestData $data): Collection
    {
        $withImage = $data->image_generation ?? false;

        return collect($this->recipeAIGenerationAction->generate($data, $withImage))->map(
            fn (GeneratedRecipe $generated): Recipe => $this->recipeStoreAction->execute(
                $user,
                $generated->data,
                $withImage ? $generated->imageDataUrl : null,
            )
        );
    }
}
