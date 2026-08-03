<?php

namespace App\Actions\Recipes;

use Exception;
use Illuminate\Support\Facades\Http;
use OpenAI\Contracts\ClientContract;

class RecipeImageAIGenerationAction
{
    private ?ClientContract $client;

    public function __construct()
    {
        $client = app('openai.client');
        $this->client = $client instanceof ClientContract ? $client : null;
    }

    /**
     * Generate a recipe image using OpenRouter Gemini and return base64
     */
    public function execute(string $prompt): string
    {
        if (! $this->client) {
            throw new Exception('AI image generation is not configured');
        }

        $apiKey = config('services.openai.api_key');
        $baseUri = config('services.openai.base_uri', 'https://api.openai.com/v1');
        $appUrl = config('app.url');
        $appName = config('app.name');

        if (! is_string($apiKey) || $apiKey === '' || ! is_string($baseUri) || $baseUri === '') {
            throw new Exception('AI image generation is not configured');
        }

        $responseArray = Http::withHeaders([
            'Authorization' => 'Bearer '.$apiKey,
            'HTTP-Referer' => is_string($appUrl) ? $appUrl : '',
            'X-Title' => is_string($appName) ? $appName : '',
        ])->timeout(60)->post($baseUri.'/chat/completions', [
            'model' => 'google/gemini-2.5-flash-image',
            'messages' => [
                [
                    'role' => 'user',
                    'content' => 'Generate an image of: '.$this->buildPrompt($prompt),
                ],
            ],
            'modalities' => ['image'],
        ])->json();

        if (! is_array($responseArray)) {
            throw new Exception('Invalid response returned from API');
        }

        $choices = $responseArray['choices'] ?? null;
        if (! is_array($choices)) {
            throw new Exception('Invalid response returned from API');
        }

        $firstChoice = $choices[0] ?? null;
        if (! is_array($firstChoice)) {
            throw new Exception('Invalid response returned from API');
        }

        $message = $firstChoice['message'] ?? null;
        if (! is_array($message)) {
            throw new Exception('Invalid response returned from API');
        }

        $images = $message['images'] ?? null;
        if (! is_array($images)) {
            throw new Exception('Invalid response returned from API');
        }

        $firstImage = $images[0] ?? null;
        if (! is_array($firstImage)) {
            throw new Exception('Invalid response returned from API');
        }

        $imageUrl = $firstImage['image_url'] ?? null;
        if (! is_array($imageUrl)) {
            throw new Exception('Invalid response returned from API');
        }

        $dataUri = $imageUrl['url'] ?? null;

        if (! is_string($dataUri) || $dataUri === '') {
            throw new Exception('No image data returned from API');
        }

        if (! preg_match('/^data:image\/(\w+);base64,(.+)$/', $dataUri, $matches)) {
            throw new Exception('Invalid image data format');
        }

        $base64Data = $matches[2];

        $decodedSize = strlen(base64_decode($base64Data));
        if ($decodedSize > 5 * 1024 * 1024) {
            throw new Exception('Generated image exceeds 5MB limit');
        }

        return 'data:image/png;base64,'.$base64Data;
    }

    /**
     * Build an optimized prompt for food photography
     */
    private function buildPrompt(string $prompt): string
    {
        return "A professional food photography of {$prompt}, appetizing presentation, "
               .'high quality, well-lit, centered on a clean white plate, neutral background, '
               .'culinary magazine style, realistic, detailed';
    }
}
