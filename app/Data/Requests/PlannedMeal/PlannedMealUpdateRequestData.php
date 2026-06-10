<?php

namespace App\Data\Requests\PlannedMeal;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class PlannedMealUpdateRequestData extends Data
{
    public function __construct(
        public string $recipe_id,
        public int $meal_time_id,
        public string $planned_date,
        #[Optional]
        public ?int $serving_size = null,
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
            'serving_size' => ['sometimes', 'integer', 'min:1', 'max:255'],
        ];
    }
}
