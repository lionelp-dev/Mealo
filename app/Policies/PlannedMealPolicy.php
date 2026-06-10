<?php

namespace App\Policies;

use App\Models\PlannedMeal;
use App\Models\Recipe;
use App\Models\User;
use App\Models\Workspace;

class PlannedMealPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, PlannedMeal $plannedMeal): bool
    {
        return $user->id === $plannedMeal->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function store(User $user, Workspace $workspace, Recipe $recipe): bool
    {
        setPermissionsTeamId($workspace->id);

        $recipe_user = $recipe->user()->first();

        if (
            $recipe_user
            && $workspace->hasUser($recipe_user)
            && $workspace->hasUser($user)
            && $user->hasPermissionTo('workspace.planned-meal.store')
        ) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, PlannedMeal $plannedMeal): bool
    {

        $recipe_user = $plannedMeal->recipe?->user();
        if (
            ! $plannedMeal->workspace
            || ! $plannedMeal->workspace->hasUser($user)) {
            return false;
        }

        setPermissionsTeamId($plannedMeal->workspace->id);

        return $user->hasPermissionTo('workspace.planned-meal.update');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Workspace $workspace): bool
    {
        setPermissionsTeamId($workspace->id);

        if (
            $workspace->hasUser($user)
            && $user->hasPermissionTo('workspace.planned-meal.destroy')
        ) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, PlannedMeal $plannedMeal): bool
    {
        return $user->id === $plannedMeal->user_id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, PlannedMeal $plannedMeal): bool
    {
        return $user->id === $plannedMeal->user_id;
    }
}
