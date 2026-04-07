<?php

namespace App\Policies;

use App\Exceptions\WokspaceInvitation\CannotCancelWorkspaceInvitationException;
use App\Exceptions\WokspaceInvitation\NotForYouWorkspaceInvitationException;
use App\Models\User;
use App\Models\WorkspaceInvitation;
use Illuminate\Auth\Access\Response;

class WorkspaceInvitationPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user): bool
    {
        return true;
    }

    public function delete(User $user, WorkspaceInvitation $workspaceInvitation): Response
    {
        setPermissionsTeamId($workspaceInvitation->workspace_id);

        return $workspaceInvitation->workspace?->hasUser($user) && $user->hasPermissionTo('workspace.manage')
            ? Response::allow()
            : Response::deny(new CannotCancelWorkspaceInvitationException()->getMessage());
    }

    public function accept(User $user, WorkspaceInvitation $workspaceInvitation): Response
    {
        return $user->email === $workspaceInvitation->email
            ? Response::allow()
            : Response::deny((new NotForYouWorkspaceInvitationException)->getMessage());
    }

    public function decline(User $user, WorkspaceInvitation $workspaceInvitation): Response
    {
        return $user->email === $workspaceInvitation->email
            ? Response::allow()
            : Response::deny((new NotForYouWorkspaceInvitationException)->getMessage());
    }
}
