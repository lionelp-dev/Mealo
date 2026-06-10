<?php

namespace App\Data\Requests\PlannedMeal;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class PlannedMealDestroyRequestData extends Data
{
    public function __construct(
        /** @var int[] */
        public array $planned_meals,
    ) {}

    /**
     * @return array<string, array<string>>
     */
    public static function rules(): array
    {
        return [
            'planned_meals' => ['required', 'array'],
            'planned_meals.*' => ['integer', 'exists:planned_meals,id'],
        ];
    }
}
