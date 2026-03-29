<?php

namespace App\Actions\Recipes;

use App\Data\Requests\Recipe\FilterRecipesRequestData;
use App\Models\Recipe;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

class FilterRecipesAction
{
    /**
     * Apply filters to a recipe query.
     *
     * @return Builder<Recipe>
     */
    public function __invoke(User $user, FilterRecipesRequestData $filters): Builder
    {
        $query = Recipe::query()
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->with(['mealTimes', 'ingredients', 'steps', 'tags']);

        if (! empty($filters->search)) {
            $query->where('name', 'LIKE', '%'.$filters->search.'%');
        }

        if (! empty($filters->preparation_time)) {
            $this->applyTimeFilter($query, 'preparation_time', $filters->preparation_time);
        }

        if (! empty($filters->cooking_time)) {
            $this->applyTimeFilter($query, 'cooking_time', $filters->cooking_time);
        }

        if (! empty($filters->tags)) {
            foreach ($filters->tags as $tagId) {
                $query->whereHas('tags', function (Builder $query) use ($tagId): void {
                    $query->where('tags.id', $tagId);
                });
            }
        }

        if (! empty($filters->meal_times)) {
            $query->whereHas('mealTimes', function (Builder $qurey) use ($filters): void {
                $qurey->whereIn('meal_times.id', $filters->meal_times);
            });
        }

        return $query;
    }

    /**
     * Apply time-based filter to query.
     *
     * @param  Builder<Recipe>  $query
     */
    private function applyTimeFilter(Builder $query, string $field, string $timeRange): void
    {
        match ($timeRange) {
            '[0..15]' => $query->where($field, '<=', 15),
            '[15..30]' => $query->whereBetween($field, [16, 30]),
            '[30..60]' => $query->whereBetween($field, [31, 60]),
            '>60' => $query->where($field, '>', 60),
            default => null,
        };
    }
}
