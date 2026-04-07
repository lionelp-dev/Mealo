<?php

namespace App\Actions\Workspace;

use App\Data\Requests\Workspace\DeclineWorkspaceInvitationRequestData;
use App\Exceptions\WokspaceInvitation\NotFoundWorkspaceInvitationException;
use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceInvitation;
use Illuminate\Support\Facades\Gate;

class DeclineWorkspaceInvitationAction
{
    /**
     * Decline a workspace invitation.
     */
    public function execute(
        User $user,
        DeclineWorkspaceInvitationRequestData $declineWorkspaceInvitationRequestData,
    ): bool {
        $workspaceInvitation = WorkspaceInvitation::where('token', $declineWorkspaceInvitationRequestData->token)->first();

        if (! $workspaceInvitation) {
            throw new NotFoundWorkspaceInvitationException;
        }

        Gate::authorize('decline', $workspaceInvitation);

        $workspaceInvitation->delete();

        return true;
    }
}
