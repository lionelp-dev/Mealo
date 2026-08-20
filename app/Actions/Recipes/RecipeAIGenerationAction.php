<?php

namespace App\Actions\Recipes;

use App\Clients\Ai\RecipeAIClient;
use App\Data\Requests\Recipe\RecipeAIGenerationRequestData;
use App\Data\Requests\Recipe\RecipeStoreRequestData;
use Exception;
use Illuminate\Support\Arr;

class RecipeAIGenerationAction
{
    public function __construct(private readonly RecipeAIClient $recipeAIClient) {}

    /**
     * @return array<int, GeneratedRecipe>
     */
    public function generate(RecipeAIGenerationRequestData $requestData, bool $generateImages = false): array
    {
        try {
            return array_map(
                function (array $recipe): GeneratedRecipe {
                    // The image data URL is a trusted sibling field from the AI service;
                    // pull it out before validation since it isn't part of the store DTO.
                    $imageDataUrl = Arr::pull($recipe, 'image_data_url');

                    return new GeneratedRecipe(
                        RecipeStoreRequestData::validateAndCreate($recipe),
                        is_string($imageDataUrl) ? $imageDataUrl : null,
                    );
                },
                $this->recipeAIClient->generate($requestData, $generateImages)
            );
        } catch (Exception $e) {
            throw new Exception('Failed to generate recipes: '.$e->getMessage());
        }
    }

    /**
     * @return array<int, GeneratedRecipe>
     */
    public function execute(RecipeAIGenerationRequestData $requestData, bool $generateImages = false): array
    {
        return $this->generate($requestData, $generateImages);
    }
}
