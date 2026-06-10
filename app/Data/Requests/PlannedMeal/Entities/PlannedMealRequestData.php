<?php

namespace App\Data\Requests\PlannedMeal\Entities;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class PlannedMealRequestData extends Data
{
    public function __construct(
        public string $recipe_id,
        public int $meal_time_id,
        public string $planned_date,
        public int $serving_size,
    ) {}

    /**
     * @return array<string, array<string>>
     */
    public static function rules(): array
    {
        return [
            'recipe_id' => ['required', 'string', 'exists:recipes,id'],
            'meal_time_id' => ['required', 'integer', 'exists:meal_times,id'],
            'planned_date' => ['required', 'date'],
            'serving_size' => ['required', 'integer', 'min:1', 'max:255'],
        ];
    }
}
