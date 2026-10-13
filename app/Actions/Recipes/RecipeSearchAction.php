<?php

namespace App\Actions\Recipes;

use App\Data\Requests\Recipe\RecipeSearchRequestData;
use App\Models\Recipe;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

class RecipeSearchAction
{
    /**
     * @param  Builder<Recipe>  $query
     * @return Builder<Recipe>
     */
    public function __invoke(
        User $user,
        Builder $query,
        RecipeSearchRequestData $recipeSearchRequestData
    ): Builder {
        if (! empty($recipeSearchRequestData->search)) {
            $query->whereLike('name', '%'.$recipeSearchRequestData->search.'%');
        }

        return $query;
    }
}
