<?php

namespace App\Data\Requests\ShoppingList;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class ShoppingListToggleIngredientRequestData extends Data
{
    public function __construct(
        public bool $is_checked,
    ) {}

    /**
     * @return array<string, array<string>>
     */
    public static function rules(): array
    {
        return [
            'is_checked' => ['required', 'boolean:strict'],
        ];
    }
}
