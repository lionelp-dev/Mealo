<?php

namespace App\Actions\Recipes;

use App\Data\Requests\Recipe\RecipeFiltersRequestData;
use App\Models\Recipe;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

class RecipeFiltersAction
{
    /**
     * @param  Builder<Recipe>  $query
     * @return Builder<Recipe>
     */
    public function __invoke(
        User $user,
        Builder $query,
        RecipeFiltersRequestData $recipeFiltersRequestData
    ): Builder {
        if (! empty($recipeFiltersRequestData->preparation_time)) {
            $this->applyTimeFilter($query, 'preparation_time', $recipeFiltersRequestData->preparation_time);
        }

        if (! empty($recipeFiltersRequestData->cooking_time)) {
            $this->applyTimeFilter($query, 'cooking_time', $recipeFiltersRequestData->cooking_time);
        }

        if (! empty($recipeFiltersRequestData->tags)) {
            foreach ($recipeFiltersRequestData->tags as $tagId) {
                $query->whereHas('tags', function (Builder $query) use ($tagId): void {
                    $query->where('tags.id', $tagId);
                });
            }
        }

        if (! empty($recipeFiltersRequestData->meal_times)) {
            $query->whereHas('mealTimes', function (Builder $qurey) use ($recipeFiltersRequestData): void {
                $qurey->whereIn('meal_times.id', $recipeFiltersRequestData->meal_times);
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
