<?php

namespace App\Data\Requests\Recipe;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class RecipeFormRequestData extends Data
{
    public function __construct(
        #[Optional]
        public ?string $ingredients_search,
        #[Optional]
        public ?string $tags_search,
        #[Optional]
        public ?bool $show_generate_recipe_with_ai_modal,
    ) {}

    /**
     * @return array<string, string>
     */
    public static function rules(): array
    {
        return [
            'ingredients_search' => 'sometimes|required|string|min:0|max:255',
            'tags_search' => 'sometimes|required|string|min:0|max:255',
            'show_generate_recipe_with_ai_modal' => 'sometimes|required|boolean',
        ];
    }
}
