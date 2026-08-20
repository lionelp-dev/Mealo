<?php

namespace App\Clients\Ai;

use App\Data\Requests\Recipe\RecipeAIGenerationRequestData;
use RuntimeException;
use UnexpectedValueException;

final class RecipeAIClient
{
    public function __construct(
        private AIHttpClient $http,
    ) {}

    /**
     * @return array<int, array<string, mixed>>
     */
    public function generate(RecipeAIGenerationRequestData $payload, bool $generateImages = false): array
    {
        $response = $this->http->post(
            '/internal/recipes/generate',
            $payload->aiPayload($generateImages),
            90,
        );

        if ($response->failed()) {
            throw new RuntimeException(
                "AI recipe generation request failed with status {$response->status()}."
            );
        }

        $data = $response->json();

        if (! is_array($data) || ! array_key_exists('recipes', $data) || ! is_array($data['recipes'])) {
            throw new UnexpectedValueException('AI recipe generation response must contain a recipes array.');
        }

        /** @var array<int, array<string, mixed>> $recipes */
        $recipes = $data['recipes'];

        return $recipes;
    }
}
