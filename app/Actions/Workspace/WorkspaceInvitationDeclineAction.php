<?php

namespace App\Actions\Workspace;

use App\Data\Requests\Workspace\WorkspaceInvitationDeclineRequestData;
use App\Exceptions\WokspaceInvitation\NotForYouWorkspaceInvitationException;
use App\Exceptions\WokspaceInvitation\NotFoundWorkspaceInvitationException;
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
            throw new NotFoundWorkspaceInvitationException;
        }

        if ($user->email !== $workspaceInvitation->email) {
            throw new NotForYouWorkspaceInvitationException();
        }

        $workspaceInvitation->delete();

        return true;
    }
}
