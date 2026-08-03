<?php

namespace App\Actions\Workspace;

use App\Data\Requests\Workspace\WorkspaceMemberDeleteRequestData;
use App\Exceptions\Workspace\WorkspaceOwnerRemoveAuthorizationException;
use App\Exceptions\Workspace\WorkspaceMemberNotFoundException;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Support\Facades\DB;

class WorkspaceMemberDeleteAction
{
    /**
     * Remove a member from a workspace.
     */
    public function execute(
        Workspace $workspace,
        WorkspaceMemberDeleteRequestData $deleteWorkspaceMemberRequestData
    ): void {
        /** @var User $user */
        $user = User::query()->findOrFail($deleteWorkspaceMemberRequestData->user_id);

        if ($workspace->owner_id === $user->id) {
            throw new WorkspaceOwnerRemoveAuthorizationException;
        }

        if (! $workspace->hasUser($user)) {
            throw new WorkspaceMemberNotFoundException;
        }

        DB::transaction(function () use ($workspace, $user): void {
            $workspace->removeUserPermissions($user);
            $workspace->users()->detach($user->id);
        });
    }
}
