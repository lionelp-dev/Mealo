<?php

namespace App\Policies;

use App\Exceptions\Workspace\CannotDeleteWorkspaceException;
use App\Exceptions\Workspace\CannotEditPlanningWorkspaceException;
use App\Exceptions\Workspace\CannotInviteToWorkspaceException;
use App\Exceptions\Workspace\CannotManageWorkspaceMembersException;
use App\Exceptions\Workspace\CannotUpdateWorkspaceException;
use App\Exceptions\Workspace\CannotViewWorkspaceException;
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
            : Response::deny((new CannotViewWorkspaceException)->getMessage());
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Workspace $workspace): Response
    {
        if ($workspace->is_default) {
            return Response::deny((new CannotUpdateWorkspaceException)->getMessage());
        }

        setPermissionsTeamId($workspace->id);

        return $workspace->hasUser($user) && $user->hasPermissionTo('workspace.edit')
            ? Response::allow()
            : Response::deny((new CannotUpdateWorkspaceException)->getMessage());
    }

    public function delete(User $user, Workspace $workspace): Response
    {
        if ($workspace->is_default) {
            return Response::deny((new CannotDeleteWorkspaceException)->getMessage());
        }

        setPermissionsTeamId($workspace->id);

        return $workspace->hasUser($user) && $user->hasPermissionTo('workspace.manage')
            ? Response::allow()
            : Response::deny((new CannotDeleteWorkspaceException)->getMessage());
    }

    public function invite(User $user, Workspace $workspace): Response
    {
        if ($workspace->is_default) {
            return Response::deny((new CannotInviteToWorkspaceException)->getMessage());
        }

        setPermissionsTeamId($workspace->id);

        return $workspace->hasUser($user) && $user->hasPermissionTo('workspace.manage')
            ? Response::allow()
            : Response::deny((new CannotInviteToWorkspaceException)->getMessage());
    }

    public function manageMember(User $user, Workspace $workspace): Response
    {
        setPermissionsTeamId($workspace->id);

        return $workspace->hasUser($user) && $user->hasPermissionTo('workspace.manage')
             ? Response::allow()
             : Response::deny((new CannotManageWorkspaceMembersException)->getMessage());
    }

    public function editPlanning(User $user, Workspace $workspace): Response
    {
        setPermissionsTeamId($workspace->id);

        return $workspace->hasUser($user) && $user->hasPermissionTo('planning.edit')
            ? Response::allow()
            : Response::deny((new CannotEditPlanningWorkspaceException)->getMessage());
    }
}
