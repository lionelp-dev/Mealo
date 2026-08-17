<?php

namespace App\Data\Requests\PlannedMeal;

use App\Data\Requests\PlannedMeal\Entities\MealTimeConfigData;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class PlannedMealGeneratePlanRequestData extends Data
{
    /**
     * @param  MealTimeConfigData[]  $meal_times
     */
    public function __construct(
        public string $startDate,
        public string $endDate,
        public int $serving_size,
        #[DataCollectionOf(MealTimeConfigData::class)]
        public array $meal_times = [],
        public ?int $variant = null,
        public float $maxSimilarity = 0.6,
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
            'meal_times' => ['sometimes', 'array'],
            'meal_times.*.name' => ['required_with:meal_times', 'string'],
            'meal_times.*.distribution' => ['required_with:meal_times', 'array'],
            'meal_times.*.distribution.*' => ['integer', 'min:1'],
            'variant' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'maxSimilarity' => ['sometimes', 'numeric', 'min:0', 'max:1'],
        ];
    }
}
