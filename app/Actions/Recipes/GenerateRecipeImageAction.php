<?php

namespace App\Actions\Recipes;

use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GenerateRecipeImageAction
{
    private $client;

    public function __construct()
    {
        $this->client = app('openai.client');
    }

    /**
     * Generate a recipe image using OpenRouter Gemini and return base64
     */
    public function execute(string $prompt): string
    {
        if (! $this->client) {
            throw new Exception('AI image generation is not configured');
        }

        $responseArray = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.openai.api_key'),
            'HTTP-Referer' => config('app.url'),
            'X-Title' => config('app.name'),
        ])->timeout(60)->post(config('services.openai.base_uri') . '/chat/completions', [
            'model' => 'google/gemini-2.5-flash-image',
            'messages' => [
                [
                    'role' => 'user',
                    'content' => 'Generate an image of: ' . $this->buildPrompt($prompt),
                ],
            ],
            'modalities' => ['image'],
        ])->json();

        $dataUri = $responseArray['choices'][0]['message']['images'][0]['image_url']['url'] ?? null;

        if (! $dataUri) {
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

        return 'data:image/png;base64,' . $base64Data;
    }

    /**
     * Build an optimized prompt for food photography
     */
    private function buildPrompt(string $prompt): string
    {
        return "A professional food photography of {$prompt}, appetizing presentation, "
               . 'high quality, well-lit, centered on a clean white plate, neutral background, '
               . 'culinary magazine style, realistic, detailed';
    }
}
