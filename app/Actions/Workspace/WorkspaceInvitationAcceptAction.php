<?php

namespace App\Actions\Workspace;

use App\Data\Requests\Workspace\WorkspaceInvitationAcceptRequestData;
use App\Exceptions\WorkspaceInvitation\WorkspaceInvitationExpiredException;
use App\Exceptions\WorkspaceInvitation\WorkspaceInvitationRespondAuthorizationException;
use App\Exceptions\WorkspaceInvitation\WorkspaceInvitationNotFoundException;
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
            throw new WorkspaceInvitationNotFoundException();
        }

        if ($user->email !== $workspaceInvitation->email) {
            throw new WorkspaceInvitationRespondAuthorizationException();
        }

        if ($workspaceInvitation->isExpired()) {
            throw new WorkspaceInvitationExpiredException();
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
