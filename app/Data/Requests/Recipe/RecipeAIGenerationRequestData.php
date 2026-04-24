<?php

namespace App\Data\Requests\Recipe;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class RecipeAIGenerationRequestData extends Data
{
    public function __construct(
        public string $prompt,
        #[Optional]
        public ?bool $image_generation,
    ) {}

    /**
     * @return array<string, string>
     */
    public static function rules(): array
    {
        return [
            'prompt' => 'required|string|min:5|max:255',
            'image_generation' => 'sometimes|required|boolean',
        ];
    }
}
