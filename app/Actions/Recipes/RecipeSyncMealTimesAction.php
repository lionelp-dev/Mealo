<?php

namespace App\Actions\Recipes;

use App\Data\Requests\Recipe\Entities\MealTimeRequestData;
use App\Models\MealTime;
use App\Models\Recipe;

class RecipeSyncMealTimesAction
{
    /**
     * Sync meal times for a recipe.
     *
     * @param  array<MealTimeRequestData>  $mealTimesData
     */
    public function __invoke(Recipe $recipe, array $mealTimesData): void
    {
        $mealTimeIds = collect($mealTimesData)
            ->map(function (MealTimeRequestData $mealTimeData): int {
                $mealTime = MealTime::query()
                    ->where('name', $mealTimeData->name)
                    ->firstOrFail();

                return $mealTime->id;
            });

        $recipe->mealTimes()->sync($mealTimeIds);
    }
}
