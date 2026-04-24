<?php

namespace App\Actions\Recipes;

use App\Data\Requests\Recipe\Entities\IngredientRequestData;
use App\Models\Ingredient;
use App\Models\Recipe;

class RecipeSyncIngredientsAction
{
    /**
     * @param  array<IngredientRequestData>  $ingredientsData
     */
    public function __invoke(Recipe $recipe, array $ingredientsData): void
    {
        if (! $recipe->user) {
            throw new \RuntimeException('Recipe must have a user to sync ingredients');
        }

        $recipeIngredient = collect($ingredientsData)->flatMap(function (IngredientRequestData $ingredientData) use ($recipe) {

            $ingredient = Ingredient::query()->firstOrCreate([
                'name' => $ingredientData->name,
                'user_id' => $recipe->user->id,
            ]);

            return [
                $ingredient->id => [
                    'quantity' => $ingredientData->quantity,
                    'unit' => $ingredientData->unit,
                ],
            ];

        });

        $recipe->ingredients()->sync($recipeIngredient);
    }
}
