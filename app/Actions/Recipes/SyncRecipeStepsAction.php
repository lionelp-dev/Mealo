<?php

namespace App\Actions\Recipes;

use App\Data\Recipe\Entities\StepData;
use App\Models\Recipe;

class SyncRecipeStepsAction
{
    /**
     * Sync steps for a recipe.
     *
     * @param  StepData[]  $stepsData
     */
    public function __invoke(Recipe $recipe, array $stepsData): void
    {
        $recipe->steps()->delete();

        $steps = collect($stepsData)
            ->map(function (StepData $stepData) use ($recipe) {
                return [
                    'recipe_id' => $recipe->id,
                    'order' => $stepData->order,
                    'description' => $stepData->description,
                ];
            })
            ->all();

        $recipe->steps()->createMany($steps);
    }
}
