<?php

namespace App\Actions\Recipes;

use App\Clients\Ai\RecipeAIClient;
use App\Data\Requests\Recipe\RecipeAIGenerationRequestData;
use App\Data\Requests\Recipe\RecipeStoreRequestData;
use Exception;

class RecipeAIGenerationAction
{
    public function __construct(private readonly RecipeAIClient $recipeAIClient) {}

    /**
     * @return array<int, RecipeStoreRequestData>
     */
    public function generate(RecipeAIGenerationRequestData $requestData): array
    {
        try {
            return array_map(
                fn (array $recipe): RecipeStoreRequestData => RecipeStoreRequestData::validateAndCreate($recipe),
                $this->recipeAIClient->generate($requestData)
            );
        } catch (Exception $e) {
            throw new Exception('Failed to generate recipes: '.$e->getMessage());
        }
    }

    /**
     * @return array<int, RecipeStoreRequestData>
     */
    public function execute(RecipeAIGenerationRequestData $requestData): array
    {
        return $this->generate($requestData);
    }
}
