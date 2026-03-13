<?php

namespace App\Policies;

use App\Models\BetaRequest;
use App\Models\User;

class BetaRequestPolicy
{
    /**
     * Check if user has global manage-beta permission.
     * IMPORTANT: access-admin-panel is a GLOBAL permission (no workspace scope).
     */
    private function hasManageBetaPermission(User $user): bool
    {
        // Set team context to null for global permission check
        setPermissionsTeamId(null);

        return $user->can('access-admin-panel');
    }

    /**
     * Determine whether the user can view any beta requests.
     */
    public function viewAny(User $user): bool
    {
        return $this->hasManageBetaPermission($user);
    }

    /**
     * Determine whether the user can view the beta request.
     */
    public function view(User $user, BetaRequest $betaRequest): bool
    {
        return $this->hasManageBetaPermission($user);
    }

    /**
     * Determine whether the user can approve beta requests.
     */
    public function approve(User $user, BetaRequest $betaRequest): bool
    {
        return $this->hasManageBetaPermission($user) && $betaRequest->status === 'pending';
    }

    /**
     * Determine whether the user can reject beta requests.
     */
    public function reject(User $user, BetaRequest $betaRequest): bool
    {
        return $this->hasManageBetaPermission($user) && $betaRequest->status === 'pending';
    }

    /**
     * Determine whether the user can resend invitation.
     * Note: Token validity is checked in the controller, not here.
     */
    public function resend(User $user, BetaRequest $betaRequest): bool
    {
        return $this->hasManageBetaPermission($user)
            && $betaRequest->status === 'approved';
    }

    /**
     * Determine whether the user can perform cleanup operations.
     */
    public function cleanup(User $user): bool
    {
        return $this->hasManageBetaPermission($user);
    }

    /**
     * Determine whether the user can update the beta request.
     */
    public function update(User $user, BetaRequest $betaRequest): bool
    {
        return $this->hasManageBetaPermission($user);
    }

    /**
     * Determine whether the user can delete the beta request.
     */
    public function delete(User $user, BetaRequest $betaRequest): bool
    {
        return $this->hasManageBetaPermission($user);
    }
}
