<?php

namespace App\Actions\Recipes;

use App\Data\Requests\Recipe\Entities\StepRequestData;
use App\Models\Recipe;

class RecipeSyncStepsAction
{
    /**
     * Sync steps for a recipe.
     *
     * @param  array<StepRequestData>  $stepsData
     */
    public function __invoke(Recipe $recipe, array $stepsData): void
    {
        $recipe->steps()->delete();

        $steps = collect($stepsData)
            ->map(function (StepRequestData $stepData) use ($recipe): array {
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
