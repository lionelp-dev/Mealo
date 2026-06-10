<?php

namespace App\Actions\PlannedMeal;

use App\Models\PlannedMeal;
use App\Models\Workspace;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;

class PlannedMealWeekQueryAction
{
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
            ->with(['recipe:id,name,image_path', 'user:id,name'])
            ->whereBetween('planned_date', [$weekStart, $weekEnd])
            ->get();
    }
}
