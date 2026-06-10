<?php

namespace App\Actions\PlannedMeal;

use App\Data\Requests\PlannedMeal\PlannedMealDestroyRequestData;
use App\Models\PlannedMeal;
use App\Models\User;
use App\Models\Workspace;
use Http\Discovery\Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class PlannedMealDestroyAction
{
    public function execute(User $user, Workspace $workspace, PlannedMealDestroyRequestData $data): int
    {
        Gate::forUser($user)->authorize('delete', [PlannedMeal::class, $workspace]);

        return DB::transaction(function () use ($workspace, $data): int {
            $plannedMealIds = $data->planned_meals;

            $plannedMeals = PlannedMeal::query()
                ->whereIn('id', $plannedMealIds)
                ->where('workspace_id', $workspace->id)
                ->get();

            if ($plannedMeals->count() !== count($plannedMealIds)) {
                abort(403, 'Some planned meals are not accessible in this workspace');
            }

            foreach ($plannedMeals as $plannedMeal) {
                $plannedMeal->delete();
            }

            return $plannedMeals->count();
        });
    }
}
