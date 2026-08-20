<?php

namespace App\Data\Requests\Recipe;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class RecipeAIGenerationRequestData extends Data
{
    public const DEFAULT_MESSAGE_CONTENT = 'Génère des recettes variées, réalistes et différentes adaptées au moment du repas demandé.';

    /**
     * @param  array{role?: string|null, content?: string|null}|null  $message
     * @param  array{meal_time?: string|null, count?: int|null}|null  $context
     */
    public function __construct(
        #[Optional]
        public ?string $prompt = null,
        #[Optional]
        public ?array $message = null,
        #[Optional]
        public ?array $context = null,
        #[Optional]
        public ?bool $image_generation = false,
    ) {}

    /**
     * @param  bool  $generateImages  Ask the AI service to also generate an image per recipe
     *                                (inline base64). Only the synchronous generate-and-store
     *                                flow opts in; other flows handle images on the Laravel side.
     * @return array{message: array{role: string, content: string}, context: array{meal_time: string|null, count: int|null, generate_images: bool}}
     */
    public function aiPayload(bool $generateImages = false): array
    {
        $messageContent = $this->message['content'] ?? $this->prompt;

        if (! is_string($messageContent) || trim($messageContent) === '') {
            $messageContent = self::DEFAULT_MESSAGE_CONTENT;
        }

        return [
            'message' => [
                'role' => $this->message['role'] ?? 'user',
                'content' => $messageContent,
            ],
            'context' => [
                'meal_time' => $this->context['meal_time'] ?? null,
                'count' => $this->context['count'] ?? null,
                'generate_images' => $generateImages,
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function rules(): array
    {
        return [
            'prompt' => 'sometimes|string|min:5|max:255',
            'message' => 'sometimes|nullable|array',
            'message.role' => 'sometimes|nullable|string|in:user',
            'message.content' => 'sometimes|nullable|string|max:255',
            'context' => 'sometimes|nullable|array',
            'context.meal_time' => 'sometimes|nullable|string|max:50',
            'context.count' => 'sometimes|nullable|integer|min:1|max:10',
            'image_generation' => 'sometimes|boolean',
        ];
    }
}
