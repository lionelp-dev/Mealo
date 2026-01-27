<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Workspace;

class WorkspacePolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Workspace $workspace): bool
    {
        // Check if user is member of workspace and has view permissions
        setPermissionsTeamId($workspace->id);
        return $workspace->hasUser($user) && $user->hasPermissionTo('workspace.view');
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Workspace $workspace): bool
    {
        // Check if user is member and has edit permissions (owner or editor roles)
        setPermissionsTeamId($workspace->id);
        return $workspace->hasUser($user) && $user->hasPermissionTo('workspace.edit');
    }

    public function delete(User $user, Workspace $workspace): bool
    {
        if ($workspace->is_personal) {
            return false;
        }

        // Only owners can delete workspaces
        setPermissionsTeamId($workspace->id);
        return $workspace->hasUser($user) && $user->hasPermissionTo('workspace.manage');
    }

    public function manageMember(User $user, Workspace $workspace): bool
    {
        // Only owners can manage members
        setPermissionsTeamId($workspace->id);
        return $workspace->hasUser($user) && $user->hasPermissionTo('workspace.manage');
    }

    public function invite(User $user, Workspace $workspace): bool
    {
        // Only owners can send invitations
        setPermissionsTeamId($workspace->id);
        return $workspace->hasUser($user) && $user->hasPermissionTo('workspace.manage');
    }

    public function editPlanning(User $user, Workspace $workspace): bool
    {
        // Check if user is member and can edit planning (owners and editors)
        setPermissionsTeamId($workspace->id);
        return $workspace->hasUser($user) && $user->hasPermissionTo('planning.edit');
    }
}

