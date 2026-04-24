<?php

namespace App\Data\Requests\Recipe;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class RecipeEditRequestData extends Data
{
    public function __construct(
        #[Optional]
        public ?bool $show_recipe_ai_generation_modal,
    ) {}

    /**
     * @return array<string, string>
     */
    public static function rules(): array
    {
        return [
            'show_recipe_ai_generation_modal' => 'sometimes|required|boolean',
        ];
    }
}
