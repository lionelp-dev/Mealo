<?php

namespace App\Actions\PlannedMeal;

use App\Data\Requests\PlannedMeal\PlannedMealStoreRequestData;
use App\Models\PlannedMeal;
use App\Models\Recipe;
use App\Models\User;
use App\Models\Workspace;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class PlannedMealStoreAction
{
    /**
     * @return PlannedMeal[]
     */
    public function execute(
        User $user,
        Workspace $workspace,
        PlannedMealStoreRequestData $plannedMealStoreRequestData
    ) {
        foreach ($plannedMealStoreRequestData->planned_meals as $plannedMealData) {
            $recipe = Recipe::findOrFail($plannedMealData->recipe_id);
            Gate::forUser($user)->authorize('store', [PlannedMeal::class, $workspace, $recipe]);
        }

        return DB::transaction(function () use ($user, $workspace, $plannedMealStoreRequestData) {
            $plannedMeals = [];
            foreach ($plannedMealStoreRequestData->planned_meals as $plannedMealData) {

                $parsedDate = Carbon::parse($plannedMealData->planned_date)->format('Y-m-d');

                $plannedMeal = PlannedMeal::query()
                    ->where('user_id', $user->id)
                    ->where('workspace_id', $workspace->id)
                    ->where('recipe_id', $plannedMealData->recipe_id)
                    ->where('meal_time_id', $plannedMealData->meal_time_id)
                    ->whereDate('planned_date', $parsedDate)
                    ->first();

                if ($plannedMeal) {
                    $plannedMeal->serving_size += $plannedMealData->serving_size;
                    $plannedMeal->save();
                    $plannedMeals[] = $plannedMeal;
                } else {
                    $plannedMeals[] = PlannedMeal::create([
                        'user_id' => $user->id,
                        'workspace_id' => $workspace->id,
                        'recipe_id' => $plannedMealData->recipe_id,
                        'meal_time_id' => $plannedMealData->meal_time_id,
                        'planned_date' => $parsedDate,
                        'serving_size' => $plannedMealData->serving_size,
                    ]);
                }
            }

            return $plannedMeals;
        });
    }
}
