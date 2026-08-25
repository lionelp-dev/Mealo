<?php

namespace App\Actions\Recipes;

use App\Clients\Ai\RecipeAIClient;
use App\Data\Requests\Recipe\RecipeAIGeneratedStoreRequestData;
use App\Data\Requests\Recipe\RecipeAIGenerationRequestData;
use Exception;

class RecipeAIGenerationAction
{
    public function __construct(private readonly RecipeAIClient $recipeAIClient) {}

    /**
     * @return array<int, RecipeAIGeneratedStoreRequestData>
     */
    public function execute(RecipeAIGenerationRequestData $requestData, bool $generateImages = false): array
    {
        try {
            return array_map(
                function (array $recipe): RecipeAIGeneratedStoreRequestData {
                    return RecipeAIGeneratedStoreRequestData::validateAndCreate($recipe);
                },
                $this->recipeAIClient->generate($requestData, $generateImages)
            );
        } catch (Exception $e) {
            throw new Exception('Failed to generate recipes: '.$e->getMessage());
        }
    }
}
