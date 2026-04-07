<?php

namespace App\Actions\Workspace;

use App\Data\Requests\Workspace\AcceptWorkspaceInvitationRequestData;
use App\Exceptions\WokspaceInvitation\ExpiredWorkspaceInvitationException;
use App\Exceptions\WokspaceInvitation\NotFoundWorkspaceInvitationException;
use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceInvitation;
use Illuminate\Support\Facades\Gate;

class AcceptWorkspaceInvitationAction
{
    /**
     * Accept  a workspace invitation.
     */
    public function execute(
        User $user,
        AcceptWorkspaceInvitationRequestData $requestData,
    ): bool {
        $workspaceInvitation = WorkspaceInvitation::where('token', $requestData->token)->first();

        if (! $workspaceInvitation) {
            throw new NotFoundWorkspaceInvitationException;
        }

        Gate::authorize('accept', $workspaceInvitation);

        if ($workspaceInvitation->isExpired()) {
            throw new ExpiredWorkspaceInvitationException;
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
