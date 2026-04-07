<?php

namespace App\Actions\Workspace;

use App\Data\Requests\Workspace\DeleteWorkspaceMemberRequestData;
use App\Exceptions\Workspace\CannotRemoveOwnerWorkspaceException;
use App\Exceptions\Workspace\MemberNotFoundWorkspaceException;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Support\Facades\DB;

class DeleteWorkspaceMemberAction
{
    /**
     * Remove a member from a workspace.
     */
    public function execute(
        Workspace $workspace,
        DeleteWorkspaceMemberRequestData $deleteWorkspaceMemberRequestData
    ): void {
        /** @var User $user */
        $user = User::query()->findOrFail($deleteWorkspaceMemberRequestData->user_id);

        if ($workspace->owner_id === $user->id) {
            throw new CannotRemoveOwnerWorkspaceException;
        }

        if (! $workspace->hasUser($user)) {
            throw new MemberNotFoundWorkspaceException;
        }

        DB::transaction(function () use ($workspace, $user): void {
            $workspace->removeUserPermissions($user);
            $workspace->users()->detach($user->id);
        });
    }
}
