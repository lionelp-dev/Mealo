<?php

namespace App\Actions\Recipes;

use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

class RecipeSearchTagsAction
{
    /**
     * @return Builder<Tag>
     */
    public function __invoke(User $user, ?string $search): Builder
    {
        $query = Tag::query()->where('user_id', $user->id);

        if (! empty($search)) {
            $query->where('name', 'like', '%'.$search.'%')
                ->orderBy('name');
        }

        return $query;
    }
}
