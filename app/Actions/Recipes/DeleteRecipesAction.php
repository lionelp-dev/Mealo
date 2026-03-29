<?php

namespace App\Actions\Recipes;

use App\Data\Requests\Recipe\DeleteRecipesRequestData;
use App\Models\Recipe;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DeleteRecipesAction
{
    public function execute(User $user, DeleteRecipesRequestData $data): int
    {
        return DB::transaction(function () use ($user, $data) {
            $deletedCount = 0;

            foreach ($data->ids as $recipeId) {
                $recipe = Recipe::query()
                    ->where('user_id', $user->id)
                    ->where('id', $recipeId)
                    ->first();

                if ($recipe) {
                    $recipe->delete();
                    $deletedCount++;
                }

            }

            return $deletedCount;
        });
    }
}
