<?php

namespace App\Data\Requests\Recipe;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class RecipeSearchRequestData extends Data
{
    public function __construct(
        #[Optional]
        public ?string $search = null,
        #[Optional]
        public ?string $ingredients_search = null,
        #[Optional]
        public ?string $tags_search = null,
    ) {}

    /**
     * @return array<string, string>
     */
    public static function rules(): array
    {
        return [
            'search' => 'sometimes|required|string|max:255',
            'ingredients_search' => 'sometimes|required|string|min:0|max:255',
            'tags_search' => 'sometimes|required|string|min:0|max:255',
        ];
    }
}
