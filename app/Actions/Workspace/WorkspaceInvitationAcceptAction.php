<?php

namespace App\Actions\Workspace;

use App\Data\Requests\Workspace\WorkspaceInvitationAcceptRequestData;
use App\Exceptions\WokspaceInvitation\ExpiredWorkspaceInvitationException;
use App\Exceptions\WokspaceInvitation\NotForYouWorkspaceInvitationException;
use App\Exceptions\WokspaceInvitation\NotFoundWorkspaceInvitationException;
use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceInvitation;

class WorkspaceInvitationAcceptAction
{
    /**
     * Accept  a workspace invitation.
     */
    public function execute(
        User $user,
        WorkspaceInvitationAcceptRequestData $requestData,
    ): bool {
        $workspaceInvitation = WorkspaceInvitation::where('token', $requestData->token)->first();

        if (! $workspaceInvitation) {
            throw new NotFoundWorkspaceInvitationException();
        }

        if ($user->email !== $workspaceInvitation->email) {
            throw new NotForYouWorkspaceInvitationException();
        }

        if ($workspaceInvitation->isExpired()) {
            throw new ExpiredWorkspaceInvitationException();
        }

        $workspaceInvitation->workspace?->users()->attach($user->id, [
            'joined_at' => now(),
        ]);

        match ($workspaceInvitation->role) {
            'editor' => $workspaceInvitation->workspace?->giveEditorPermissions($user),
            'viewer' => $workspaceInvitation->workspace?->giveViewerPermissions($user),
        };

        $workspaceInvitation->delete();

        return true;
    }
}
