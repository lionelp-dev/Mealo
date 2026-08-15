<?php

namespace App\Data\Resources\PlannedMeal;

use App\Data\Resources\Recipe\Entities\RecipeResourceData;
use App\Models\PlannedMeal;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class PlannedMealResourceData extends Data
{
    public function __construct(
        public int $id,
        public CarbonImmutable $planned_date,
        public int $meal_time_id,
        #[Optional]
        public ?string $meal_time_name,
        public int $serving_size,
        public ?RecipeResourceData $recipe,
    ) {}

    public static function fromModel(PlannedMeal $plannedMeal): self
    {
        $mealTime = $plannedMeal->relationLoaded('mealTime') ? $plannedMeal->mealTime : null;
        $recipe = $plannedMeal->relationLoaded('recipe') ? $plannedMeal->recipe : null;

        return new self(
            id: $plannedMeal->id,
            planned_date: $plannedMeal->planned_date->toImmutable(),
            meal_time_id: $plannedMeal->meal_time_id,
            meal_time_name: $mealTime?->name,
            serving_size: $plannedMeal->serving_size,
            recipe: $recipe !== null
                ? RecipeResourceData::fromModel($recipe)->include('ingredients')
                : null,
        );
    }
}
