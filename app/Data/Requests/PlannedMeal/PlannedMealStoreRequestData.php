<?php

namespace App\Data\Requests\PlannedMeal;

use App\Data\Requests\PlannedMeal\Entities\PlannedMealRequestData;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class PlannedMealStoreRequestData extends Data
{
    public function __construct(
        /** @var PlannedMealRequestData[] */
        public array $planned_meals,
    ) {}

    /**
     * @return array<string, array<string>>
     */
    public static function rules(): array
    {
        return [
            'planned_meals' => ['required', 'array'],
        ];
    }
}
