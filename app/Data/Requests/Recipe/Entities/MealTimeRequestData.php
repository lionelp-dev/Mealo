<?php

namespace App\Data\Requests\Recipe\Entities;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class MealTimeRequestData extends Data
{
    public function __construct(
        public string $name,
    ) {}

    /**
     * @return array<string, string>
     */
    public static function rules(): array
    {
        return [
            'id' => 'sometimes|required|integer|min:1',
            'name' => 'required|string|min:1|max:255',
        ];
    }
}
