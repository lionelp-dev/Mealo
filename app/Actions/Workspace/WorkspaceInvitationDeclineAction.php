<?php

namespace App\Actions\Workspace;

use App\Data\Requests\Workspace\WorkspaceInvitationDeclineRequestData;
use App\Exceptions\WorkspaceInvitation\WorkspaceInvitationRespondAuthorizationException;
use App\Exceptions\WorkspaceInvitation\WorkspaceInvitationNotFoundException;
use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceInvitation;

class WorkspaceInvitationDeclineAction
{
    /**
     * Decline a workspace invitation.
     */
    public function execute(
        User $user,
        WorkspaceInvitationDeclineRequestData $declineWorkspaceInvitationRequestData,
    ): bool {
        $workspaceInvitation = WorkspaceInvitation::where('token', $declineWorkspaceInvitationRequestData->token)->first();

        if (! $workspaceInvitation) {
            throw new WorkspaceInvitationNotFoundException;
        }

        if ($user->email !== $workspaceInvitation->email) {
            throw new WorkspaceInvitationRespondAuthorizationException();
        }

        $workspaceInvitation->delete();

        return true;
    }
}
