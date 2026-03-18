<?php

namespace App\Actions\Recipes;

use App\Models\Tag;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class SearchTagsAction
{
    /**
     * @return LengthAwarePaginator<int,Tag>
     */
    public function __invoke(User $user, ?string $search): LengthAwarePaginator
    {
        $query = Tag::query()->where('user_id', $user->id);

        if (! empty($search)) {
            $query->where('name', 'like', '%'.$search.'%')
                ->orderBy('name');
        }

        return $query->paginate(5, pageName: 'tags_page');
    }
}
