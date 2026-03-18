<?php

namespace App\Actions\Recipes;

use App\Data\Recipe\Entities\MealTimeData;
use App\Models\MealTime;
use App\Models\Recipe;

class SyncRecipeMealTimesAction
{
    /**
     * Sync meal times for a recipe.
     *
     * @param  MealTimeData[]  $mealTimesData
     */
    public function __invoke(Recipe $recipe, array $mealTimesData): void
    {
        $mealTimeIds = collect($mealTimesData)
            ->map(function (MealTimeData $mealTimeData) {
                $mealTime = MealTime::query()
                    ->where('name', $mealTimeData->name)
                    ->firstOrFail();

                return $mealTime->id;
            });

        $recipe->mealTimes()->sync($mealTimeIds);
    }
}
