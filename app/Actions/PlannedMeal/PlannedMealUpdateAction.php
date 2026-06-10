<?php

namespace App\Actions\PlannedMeal;

use App\Data\Requests\PlannedMeal\PlannedMealUpdateRequestData;
use App\Models\PlannedMeal;
use App\Models\Recipe;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class PlannedMealUpdateAction
{
    public function execute(
        User $user,
        PlannedMeal $plannedMeal,
        PlannedMealUpdateRequestData $plannedMealUpdateRequestData
    ): PlannedMeal {
        Gate::forUser($user)->authorize('workspace.planned-meal.update', $plannedMeal);

        return DB::transaction(function () use ($plannedMeal, $plannedMealUpdateRequestData): PlannedMeal {
            Recipe::findOrFail($plannedMealUpdateRequestData->recipe_id);

            $parsedDate = Carbon::parse($plannedMealUpdateRequestData->planned_date)->format('Y-m-d');

            $duplicatePlannedMeal = PlannedMeal::query()
                ->whereKeyNot($plannedMeal->id)
                ->where('user_id', $plannedMeal->user_id)
                ->where('workspace_id', $plannedMeal->workspace_id)
                ->where('recipe_id', $plannedMealUpdateRequestData->recipe_id)
                ->where('meal_time_id', $plannedMealUpdateRequestData->meal_time_id)
                ->whereDate('planned_date', $parsedDate)
                ->first();

            if ($duplicatePlannedMeal) {
                $duplicatePlannedMeal->serving_size += $plannedMealUpdateRequestData->serving_size;
                $duplicatePlannedMeal->save();

                $plannedMeal->delete();

                return $duplicatePlannedMeal->refresh();
            }

            $plannedMeal->update([
                'recipe_id' => $plannedMealUpdateRequestData->recipe_id,
                'meal_time_id' => $plannedMealUpdateRequestData->meal_time_id,
                'planned_date' => $plannedMealUpdateRequestData->planned_date,
                'serving_size' => $plannedMealUpdateRequestData->serving_size,
            ]);

            return $plannedMeal->refresh();
        });
    }
}
