<?php

namespace App\Data\Requests\Recipe;

use App\Data\Requests\Recipe\Entities\IngredientRequestData;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class RecipeImageAIGenerationRequestData extends Data
{
    public function __construct(
        public string $name,
        /** @var array<IngredientRequestData>|null $ingredients */
        #[Optional]
        public ?array $ingredients = null,
    ) {}

    /**
     * @return array<string, string>
     */
    public static function rules(): array
    {
        return [
            'name' => 'required|string|min:3|max:255',
        ];
    }
}
