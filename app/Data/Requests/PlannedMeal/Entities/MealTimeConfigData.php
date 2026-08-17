<?php

namespace App\Data\Requests\PlannedMeal\Entities;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class MealTimeConfigData extends Data
{
    /**
     * @param  int[]  $distribution
     */
    public function __construct(
        public string $name,
        public array $distribution,
    ) {}

    /**
     * @return array<string, array<string>>
     */
    public static function rules(): array
    {
        return [
            'name' => ['required', 'string'],
            'distribution' => ['required', 'array'],
            'distribution.*' => ['integer', 'min:1'],
        ];
    }
}
