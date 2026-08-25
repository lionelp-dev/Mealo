<?php

namespace App\Data\Requests\Recipe\Entities;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class MealTimeRequestData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
    ) {}

    /**
     * @return array<string, string>
     */
    public static function rules(): array
    {
        return [
            'id' => 'required|integer|exists:meal_times,id',
            'name' => 'required|string|min:1|max:255',
        ];
    }
}
