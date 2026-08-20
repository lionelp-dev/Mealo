<?php

namespace App\Actions\Recipes;

use App\Exceptions\Recipe\RecipeImageGenerationException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
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
        . 'culinary magazine style, realistic, detailed, '
        . 'no text, no typography, no letters, no words, no labels, no logos, no watermark';
    }

    /**
     * Generate a recipe image using OpenRouter and return a base64 data URL.
     */
    public function execute(string $prompt): string
    {
        try {
            $apiKey = config('ai.providers.openrouter.key');

            if (! is_string($apiKey) || $apiKey === '') {
                throw new RuntimeException('Missing OpenRouter API key');
            }

            $aiProviderUrl = config('ai.providers.openrouter.url');

            if (! is_string($aiProviderUrl) || $aiProviderUrl === '') {
                throw new RuntimeException('Missing OpenRouter provider URL');
            }

            $response = Http::baseUrl($aiProviderUrl)
                ->withToken($apiKey)
                ->withHeaders(array_filter([
                    'HTTP-Referer' => config('ai.providers.openrouter.http_referer'),
                    'X-OpenRouter-Title' => config('ai.providers.openrouter.x_title'),
                ]))
                ->timeout(60)
                ->post('images/generations', [
                    'model' => config('ai.providers.openrouter.models.image.default'),
                    'prompt' => $this->instructions($prompt),
                    'n' => 1,
                    'size' => '1024x640',
                    'quality' => 'low',
                    'output_format' => 'jpeg',
                    'output_compression' => 75,
                ]);

            if (! $response->successful()) {
                Log::warning('OpenRouter recipe image generation failed.', [
                    'status' => $response->status(),
                    'error' => $response->json('error.message') ?? $response->body(),
                ]);

                throw new RuntimeException('OpenRouter image generation failed');
            }

            $base64Data = $response->json('data.0.b64_json');

            if (! is_string($base64Data) || $base64Data === '') {
                throw new RuntimeException('No image returned by provider');
            }

            $binary = base64_decode($base64Data, true);

            if ($binary === false) {
                throw new RuntimeException('Invalid base64 image data returned by provider');
            }

            if (strlen($binary) > 5 * 1024 * 1024) {
                throw new RuntimeException('Generated image exceeds 5MB limit');
            }

            return 'data:image/jpeg;base64,' . $base64Data;
        } catch (Throwable $e) {
            throw new RecipeImageGenerationException(previous: $e);
        }
    }
}
