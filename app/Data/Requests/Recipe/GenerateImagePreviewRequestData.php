<?php

namespace App\Data\Requests\Recipe;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;
use App\Data\Requests\Recipe\Entities\IngredientRequestData;

#[TypeScript]
class GenerateImagePreviewRequestData extends Data
{
    /**
     * @param  array<int, array{name: string, quantity: float|int, unit: string}>|null  $ingredients
     */
    public function __construct(
        public string $name,
        #[Optional]
        /** @var IngredientRequestData[] */
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
