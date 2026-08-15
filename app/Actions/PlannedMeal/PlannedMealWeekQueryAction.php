<?php

namespace App\Actions\PlannedMeal;

use App\Models\PlannedMeal;
use App\Models\Workspace;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;

class PlannedMealWeekQueryAction
{
    /**
     * @return Collection<int, PlannedMeal>
     */
    public function __invoke(
        Workspace $workspace,
        ?string $week = null
    ): Collection {
        $weekStart = $week
            ? Carbon::parse($week)->startOf('week')
            : Carbon::now()->startOf('week');

        $weekEnd = $weekStart->copy()->endOf('week');

        return PlannedMeal::query()
            ->where('workspace_id', $workspace->id)
            ->with([
                'recipe.mealTimes',
                'recipe.ingredients',
                'recipe.steps',
                'recipe.tags',
                'user:id,name',
            ])
            ->whereBetween('planned_date', [$weekStart, $weekEnd])
            ->get();
    }
}
