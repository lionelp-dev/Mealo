<?php

namespace App\Data\Requests\ShoppingList;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class ShoppingListIndexRequestData extends Data
{
    public function __construct(
        #[Optional]
        public ?string $week = null,
    ) {}

    /**
     * @return array<string, array<string>>
     */
    public static function rules(): array
    {
        return [
            'week' => ['nullable', 'date'],
        ];
    }
}
