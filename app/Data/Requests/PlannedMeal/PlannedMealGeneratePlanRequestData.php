<?php

namespace App\Data\Requests\PlannedMeal;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class PlannedMealGeneratePlanRequestData extends Data
{
    public function __construct(
        public string $startDate,
        public string $endDate,
        public int $serving_size,
    ) {}

    /**
     * @return array<string, array<string>>
     */
    public static function rules(): array
    {
        return [
            'startDate' => ['required', 'date'],
            'endDate' => ['required', 'date'],
            'serving_size' => ['required', 'integer', 'min:1', 'max:255'],
        ];
    }
}
