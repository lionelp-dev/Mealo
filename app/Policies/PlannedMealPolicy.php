<?php

namespace App\Policies;

use App\Exceptions\PlannedMeal\PlannedMealDeleteAuthorizationException;
use App\Exceptions\PlannedMeal\PlannedMealStoreAuthorizationException;
use App\Exceptions\PlannedMeal\PlannedMealUpdateAuthorizationException;
use App\Models\PlannedMeal;
use App\Models\Recipe;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Auth\Access\Response;

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
    public function store(User $user, Workspace $workspace, Recipe $recipe): Response
    {
        setPermissionsTeamId($workspace->id);

        $recipe_user = $recipe->user()->first();

        if (
            $recipe_user
            && $workspace->hasUser($recipe_user)
            && $workspace->hasUser($user)
            && $user->hasPermissionTo('workspace.planned-meal.store')
        ) {
            return Response::allow();
        }

        return Response::deny(PlannedMealStoreAuthorizationException::message());
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, PlannedMeal $plannedMeal): Response
    {
        if (
            ! $plannedMeal->workspace
            || ! $plannedMeal->workspace->hasUser($user)) {
            return Response::deny(PlannedMealUpdateAuthorizationException::message());
        }

        setPermissionsTeamId($plannedMeal->workspace->id);

        return $user->hasPermissionTo('workspace.planned-meal.update')
            ? Response::allow()
            : Response::deny(PlannedMealUpdateAuthorizationException::message());
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Workspace $workspace): Response
    {
        setPermissionsTeamId($workspace->id);

        if (
            $workspace->hasUser($user)
            && $user->hasPermissionTo('workspace.planned-meal.destroy')
        ) {
            return Response::allow();
        }

        return Response::deny(PlannedMealDeleteAuthorizationException::message());
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
