<?php

namespace App\Actions\Recipes;

use App\Exceptions\Recipe\RecipeImageGenerationException;
use Laravel\Ai\Image;
use RuntimeException;
use Throwable;

class RecipeImageAIGenerationAction
{
    /**
     * Get the instructions that the agent should follow.
     */
    public function instructions(string $prompt): string
    {
        return "A professional food photography of {$prompt}, appetizing presentation, "
               . 'high quality, well-lit, centered on a clean white plate, neutral background, '
               . 'culinary magazine style, realistic, detailed';
    }

    /**
     * Generate a recipe image using Laravel AI and return a base64 data URL.
     */
    public function execute(string $prompt): string
    {
        try {
            $response = Image::of($this->instructions($prompt))
                ->square()
                ->quality('low')
                ->timeout(60)
                ->generate();
        } catch (Throwable $e) {
            throw new RecipeImageGenerationException(previous: $e);
        }

        if ($response->count() === 0) {
            throw new RecipeImageGenerationException(
                previous: new RuntimeException('No image returned by provider')
            );
        }

        $image = $response->firstImage();
        $base64Data = $image->image;

        if ($base64Data === '') {
            throw new RecipeImageGenerationException(
                previous: new RuntimeException('Empty image data returned by provider')
            );
        }

        if (base64_decode($base64Data, true) === false) {
            throw new RecipeImageGenerationException(
                previous: new RuntimeException('Invalid base64 image data returned by provider')
            );
        }

        $decodedSize = strlen((string) base64_decode($base64Data, true));
        if ($decodedSize > 5 * 1024 * 1024) {
            throw new RecipeImageGenerationException(
                previous: new RuntimeException('Generated image exceeds 5MB limit')
            );
        }

        $mime = $image->mime ?: 'image/png';

        return "data:{$mime};base64,{$base64Data}";
    }
}
