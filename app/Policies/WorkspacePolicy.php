<?php

namespace App\Policies;

use App\Exceptions\Workspace\WorkspaceDeleteAuthorizationException;
use App\Exceptions\Workspace\WorkspaceInviteAuthorizationException;
use App\Exceptions\Workspace\WorkspaceMemberManageAuthorizationException;
use App\Exceptions\Workspace\WorkspacePlanningEditAuthorizationException;
use App\Exceptions\Workspace\WorkspaceUpdateAuthorizationException;
use App\Exceptions\Workspace\WorkspaceViewAuthorizationException;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Auth\Access\Response;

class WorkspacePolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Workspace $workspace): Response
    {
        setPermissionsTeamId($workspace->id);

        return $workspace->hasUser($user) && $user->hasPermissionTo('workspace.view')
            ? Response::allow()
            : Response::deny(WorkspaceViewAuthorizationException::message());
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Workspace $workspace): Response
    {
        if ($workspace->is_default) {
            return Response::deny(WorkspaceUpdateAuthorizationException::message());
        }

        setPermissionsTeamId($workspace->id);

        return $workspace->hasUser($user) && $user->hasPermissionTo('workspace.edit')
            ? Response::allow()
            : Response::deny(WorkspaceUpdateAuthorizationException::message());
    }

    public function delete(User $user, Workspace $workspace): Response
    {
        if ($workspace->is_default) {
            return Response::deny(WorkspaceDeleteAuthorizationException::message());
        }

        setPermissionsTeamId($workspace->id);

        return $workspace->hasUser($user) && $user->hasPermissionTo('workspace.manage')
            ? Response::allow()
            : Response::deny(WorkspaceDeleteAuthorizationException::message());
    }

    public function invite(User $user, Workspace $workspace): Response
    {
        if ($workspace->is_default) {
            return Response::deny(WorkspaceInviteAuthorizationException::message());
        }

        setPermissionsTeamId($workspace->id);

        return $workspace->hasUser($user) && $user->hasPermissionTo('workspace.manage')
            ? Response::allow()
            : Response::deny(WorkspaceInviteAuthorizationException::message());
    }

    public function manageMember(User $user, Workspace $workspace): Response
    {
        setPermissionsTeamId($workspace->id);

        return $workspace->hasUser($user) && $user->hasPermissionTo('workspace.manage')
             ? Response::allow()
             : Response::deny(WorkspaceMemberManageAuthorizationException::message());
    }

    public function editPlanning(User $user, Workspace $workspace): Response
    {
        setPermissionsTeamId($workspace->id);

        return $workspace->hasUser($user) && $user->hasPermissionTo('planning.edit')
            ? Response::allow()
            : Response::deny(WorkspacePlanningEditAuthorizationException::message());
    }
}
