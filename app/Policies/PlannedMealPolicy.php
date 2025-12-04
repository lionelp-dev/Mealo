<?php

namespace App\Policies;

use App\Models\PlannedMeal;
use App\Models\Recipe;
use App\Models\User;
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
    public function create(User $user, ?Recipe $recipe = null): bool
    {
        if ($recipe) {
            return $user->id === $recipe->user_id;
        }

        return $user !== null;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, PlannedMeal $plannedMeal): bool
    {
        return $user->id === $plannedMeal->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, PlannedMeal $plannedMeal): bool
    {
        return $user->id === $plannedMeal->user_id;
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
