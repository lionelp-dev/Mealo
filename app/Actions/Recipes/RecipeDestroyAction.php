<?php

namespace App\Actions\Recipes;

use App\Data\Requests\Recipe\RecipeDestroyRequestData;
use App\Exceptions\Recipe\RecipeDeleteAuthorizationException;
use App\Models\Recipe;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class RecipeDestroyAction
{
    public function execute(User $user, RecipeDestroyRequestData $data): int
    {
        return DB::transaction(function () use ($user, $data) {
            $deletedCount = 0;

            foreach ($data->ids as $recipeId) {
                $recipe = Recipe::query()
                    ->where('user_id', $user->id)
                    ->where('id', $recipeId)
                    ->first();

                if (! isset($recipe)) {
                    throw new RecipeDeleteAuthorizationException;
                }

                $recipe->delete();
                $deletedCount++;
            }

            return $deletedCount;
        });
    }
}
