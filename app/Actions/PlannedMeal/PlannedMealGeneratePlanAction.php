<?php

namespace App\Actions\PlannedMeal;

use App\Data\Requests\PlannedMeal\PlannedMealGeneratePlanRequestData;
use App\Data\Requests\PlannedMeal\PlannedMealStoreRequestData;
use App\Exceptions\PlannedMeal\MealPlanGenerateAuthorizationException;
use App\Models\PlannedMeal;
use App\Models\User;
use App\Models\Workspace;
use App\Services\AIMealPlanningService;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Throwable;

class PlannedMealGeneratePlanAction
{
    public function execute(
        User $user,
        Workspace $workspace,
        PlannedMealGeneratePlanRequestData $data
    ): int {
        $startDate = Carbon::parse($data->startDate);
        $endDate = Carbon::parse($data->endDate);

        try {
            $generatedPlannedMeals = collect(app(AIMealPlanningService::class)->generateMealPlan([
                'userId' => $user->id,
                'workspaceId' => $workspace->id,
                'startDate' => $startDate,
                'endDate' => $endDate,
            ]))->map(function (array $meal) use ($data) {
                return array_merge(
                    $meal,
                    ['serving_size' => $data->serving_size]
                );
            })->all();

            $plannedMeals = PlannedMealStoreRequestData::from([
                'planned_meals' => $generatedPlannedMeals,
            ]);
        } catch (Throwable $e) {
            throw new MealPlanGenerateAuthorizationException(previous: $e);
        }

        $createdCount = 0;

        DB::transaction(function () use ($user, $workspace, $startDate, $endDate, $plannedMeals, $data, &$createdCount): void {
            PlannedMeal::where('user_id', $user->id)
                ->where('workspace_id', $workspace->id)
                ->whereDate('planned_date', '>=', $startDate)
                ->whereDate('planned_date', '<=', $endDate)
                ->delete();

            foreach ($plannedMeals->planned_meals as $plannedMeal) {
                PlannedMeal::create([
                    'workspace_id' => $workspace->id,
                    'user_id' => $user->id,
                    'recipe_id' => $plannedMeal->recipe_id,
                    'meal_time_id' => $plannedMeal->meal_time_id,
                    'planned_date' => $plannedMeal->planned_date,
                    'serving_size' => $data->serving_size,
                ]);
                $createdCount++;
            }
        });

        return $createdCount;
    }
}
