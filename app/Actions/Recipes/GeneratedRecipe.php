<?php

namespace App\Actions\Recipes;

use App\Data\Requests\Recipe\RecipeStoreRequestData;

/**
 * A recipe produced by the AI generation service, paired with an optional
 * AI-generated image as a base64 data URL.
 *
 * The data URL is kept out of {@see RecipeStoreRequestData} on purpose: that DTO
 * backs the public `recipes.store` endpoint and only accepts uploaded files. The
 * base64 image is a trusted, server-to-server payload applied via a method argument.
 */
final readonly class GeneratedRecipe
{
    public function __construct(
        public RecipeStoreRequestData $data,
        public ?string $imageDataUrl = null,
    ) {}
}
