<?php

namespace App\Actions\Recipes;

use App\Data\Requests\Recipe\Entities\IngredientRequestData;
use App\Models\Ingredient;
use App\Models\Recipe;

class SyncRecipeIngredientsAction
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

            $ingredient = Ingredient::query()->updateOrCreate([
                'id' => $ingredientData->id,
                'user_id' => $recipe->user->id,
            ], [
                'name' => $ingredientData->name,
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
