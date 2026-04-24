<?php

namespace App\Actions\Recipes;

use App\Models\Ingredient;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

class RecipeSearchIngredientsAction
{
    /**
     * @return Builder<Ingredient>
     */
    public function __invoke(User $user, ?string $search): Builder
    {
        $query = Ingredient::query()->where('user_id', $user->id);

        if (! empty($search)) {
            $query->where('name', 'like', '%'.$search.'%')
                ->orderBy('name');
        }

        return $query;
    }
}
