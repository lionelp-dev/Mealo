<?php

namespace App\Actions\Recipes;

use App\Ai\Agents\RecipeGenerator;
use App\Data\Requests\Recipe\RecipeAIGenerationRequestData;
use App\Data\Requests\Recipe\RecipeStoreRequestData;
use Exception;
use Laravel\Ai\Responses\StructuredAgentResponse;

class RecipeAIGenerationAction
{
    public function __construct(private readonly RecipeGenerator $recipeGenerator) {}

    /**
     * Generate a recipe using Laravel AI structured output.
     */
    public function execute(RecipeAIGenerationRequestData $promptData): RecipeStoreRequestData
    {
        try {
            $response = $this->recipeGenerator->prompt(
                $promptData->prompt,
                provider: 'openrouter',
                model: 'openai/gpt-4o-mini'
            );

            if (! $response instanceof StructuredAgentResponse) {
                throw new Exception('No valid recipe generated from AI response');
            }

            return RecipeStoreRequestData::validateAndCreate($response->toArray());
        } catch (Exception $e) {
            throw new Exception('Failed to generate recipe: '.$e->getMessage());
        }
    }
}
