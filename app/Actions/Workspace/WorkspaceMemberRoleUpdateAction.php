<?php

namespace App\Actions\Workspace;

use App\Data\Requests\Workspace\WorkspaceMemberRoleUpdateRequestData;
use App\Exceptions\Workspace\WorkspaceOwnerRoleChangeAuthorizationException;
use App\Exceptions\Workspace\WorkspaceMemberNotFoundException;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class WorkspaceMemberRoleUpdateAction
{
    /**
     * Update a member's role in a workspace.
     */
    public function execute(
        Workspace $workspace,
        WorkspaceMemberRoleUpdateRequestData $updateWorkspaceMemberRoleData
    ): void {
        /** @var User $user */
        $user = User::query()->findOrFail($updateWorkspaceMemberRoleData->user_id);

        if ($workspace->owner_id === $user->id) {
            throw new WorkspaceOwnerRoleChangeAuthorizationException;
        }

        if (! $workspace->hasUser($user)) {
            throw new WorkspaceMemberNotFoundException;
        }

        DB::transaction(function () use ($workspace, $user, $updateWorkspaceMemberRoleData): void {
            $workspace->removeUserPermissions($user);

            match ($updateWorkspaceMemberRoleData->role) {
                'editor' => $workspace->giveEditorPermissions($user),
                'viewer' => $workspace->giveViewerPermissions($user),
                default => throw new InvalidArgumentException('Invalid role: '.$updateWorkspaceMemberRoleData->role),
            };
        });
    }
}
