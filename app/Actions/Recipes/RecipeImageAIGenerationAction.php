<?php

namespace App\Actions\Recipes;

use App\Exceptions\Recipe\RecipeImageGenerationException;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\JpegEncoder;
use Intervention\Image\ImageManager;
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
        .'high quality, well-lit, centered on a clean white plate, neutral background, '
        .'culinary magazine style, realistic, detailed, '
        .'no text, no typography, no letters, no words, no labels, no logos, no watermark';
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

        $binary = base64_decode($base64Data, true);

        if ($binary === false) {
            throw new RecipeImageGenerationException(
                previous: new RuntimeException('Invalid base64 image data returned by provider')
            );
        }

        // Re-encode to JPEG to keep stored images lightweight. Providers such as
        // FLUX return large PNGs (~5MB) that would otherwise hit the 5MB limit.
        try {
            $jpeg = (string) (new ImageManager(Driver::class))
                ->decodeBinary($binary)
                ->encode(new JpegEncoder(quality: 85));
        } catch (Throwable $e) {
            throw new RecipeImageGenerationException(previous: $e);
        }

        if (strlen($jpeg) > 5 * 1024 * 1024) {
            throw new RecipeImageGenerationException(
                previous: new RuntimeException('Generated image exceeds 5MB limit')
            );
        }

        return 'data:image/jpeg;base64,'.base64_encode($jpeg);
    }
}
