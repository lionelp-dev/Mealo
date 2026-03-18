<?php

namespace App\Actions\Recipes;

use App\Models\Ingredient;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class SearchIngredientsAction
{
    /**
     * @return LengthAwarePaginator<int, Ingredient>
     */
    public function __invoke(User $user, ?string $search): LengthAwarePaginator
    {
        $query = Ingredient::query()->where('user_id', $user->id);

        if (! empty($search)) {
            $query->where('name', 'like', '%'.$search.'%')
                ->orderBy('name');
        }

        return $query->paginate(5, pageName: 'ingredients_page');
    }
}
