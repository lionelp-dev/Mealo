<?php

namespace App\Actions\Recipes;

use App\Data\Recipe\Entities\IngredientData;
use App\Models\Ingredient;
use App\Models\Recipe;
use App\Models\RecipeIngredient;

class SyncRecipeIngredientsAction
{
    /**
     * @param  IngredientData[]  $ingredientsData
     */
    public function __invoke(Recipe $recipe, array $ingredientsData): void
    {
        if (! $recipe->user) {
            throw new \RuntimeException('Recipe must have a user to sync ingredients');
        }

        collect($ingredientsData)->each(function ($ingredientData) use ($recipe) {

            $ingredient = Ingredient::query()->updateOrCreate([
                'user_id' => $recipe->user->id,
                'name' => $ingredientData->name,
            ], []);

            RecipeIngredient::query()->updateOrCreate(
                [
                    'recipe_id' => $recipe->id,
                    'ingredient_id' => $ingredient->id,
                ],
                [
                    'quantity' => $ingredientData->quantity,
                    'unit' => $ingredientData->unit,
                ]
            );
        });
    }
}
