<?php

namespace App\Actions\Recipes;

use App\Data\Requests\Recipe\RecipeDestroyRequestData;
use App\Models\Recipe;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

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
                    throw new AuthorizationException();
                }

                $recipe->delete();
                $deletedCount++;
            }

            return $deletedCount;
        });
    }
}
