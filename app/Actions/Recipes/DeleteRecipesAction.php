<?php

namespace App\Actions\Recipes;

use App\Data\Recipe\Requests\DeleteRecipesRequestData;
use App\Models\Recipe;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class DeleteRecipesAction
{
    public function execute(User $user, DeleteRecipesRequestData $data): int
    {
        return DB::transaction(function () use ($user, $data) {
            $deletedCount = 0;

            foreach ($data->recipe_ids as $recipeId) {
                $recipe = Recipe::query()
                    ->where('user_id', $user->id)
                    ->where('id', $recipeId)
                    ->first();

                if ($recipe) {
                    Gate::authorize('delete', $recipe);
                    $recipe->delete();
                    $deletedCount++;
                }

            }

            return $deletedCount;
        });
    }
}
