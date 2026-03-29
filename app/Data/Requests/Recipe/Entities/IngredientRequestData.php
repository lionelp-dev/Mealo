<?php

namespace App\Data\Requests\Recipe\Entities;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class IngredientRequestData extends Data
{
    public function __construct(
        public string $name,
        public float $quantity,
        public string $unit,
        #[Optional]
        public ?string $id = null,
    ) {}

    /**
     * @return array<string, string>
     */
    public static function rules(): array
    {
        return [
            'id' => 'sometimes|uuid:7|nullable',
            'name' => 'required|string|min:1|max:255',
            'quantity' => 'required|numeric|min:0|max:10000',
            'unit' => 'required|string|min:1|max:50',
        ];
    }
}
