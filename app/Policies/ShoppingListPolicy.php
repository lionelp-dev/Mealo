<?php

namespace App\Policies;

use App\Exceptions\ShoppingList\ShoppingListUpdateAuthorizationException;
use App\Models\ShoppingList;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ShoppingListPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ShoppingList $shoppingList): bool
    {
        return $user->id === $shoppingList->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ShoppingList $shoppingList): Response
    {
        // Check if user has planning.edit permission in the workspace
        if (! $shoppingList->workspace || ! $shoppingList->workspace->hasUser($user)) {
            return Response::deny(ShoppingListUpdateAuthorizationException::message());
        }

        setPermissionsTeamId($shoppingList->workspace->id);

        return $user->hasPermissionTo('planning.edit')
            ? Response::allow()
            : Response::deny(ShoppingListUpdateAuthorizationException::message());
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ShoppingList $shoppingList): bool
    {
        return $user->id === $shoppingList->user_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ShoppingList $shoppingList): bool
    {
        return $user->id === $shoppingList->user_id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ShoppingList $shoppingList): bool
    {
        return $user->id === $shoppingList->user_id;
    }
}
