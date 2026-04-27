<?php

namespace App\Actions\Workspace;

use App\Data\Requests\Workspace\WorkspaceInvitationStoreRequestData;
use App\Exceptions\WokspaceInvitation\AlreadyExistWorkspaceInvitationException;
use App\Exceptions\Workspace\MemberAlreadyExistWorkspaceException;
use App\Mail\WorkspaceInvitationMail;
use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceInvitation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class WorkspaceInvitationStoreAction
{
    /**
     * Create a new workspace invitation.
     */
    public function execute(
        User $user,
        Workspace $workspace,
        WorkspaceInvitationStoreRequestData $storeWorkspaceInvitationRequestData
    ): WorkspaceInvitation {
        $existingInvitation = WorkspaceInvitation::where('workspace_id', $workspace->id)
            ->where('email', $storeWorkspaceInvitationRequestData->email)
            ->where('expires_at', '>', now())
            ->exists();

        if ($existingInvitation) {
            throw new AlreadyExistWorkspaceInvitationException;
        }

        $existingUser = User::where('email', $storeWorkspaceInvitationRequestData->email)->first();

        if ($existingUser && $workspace->hasUser($existingUser)) {
            throw new MemberAlreadyExistWorkspaceException;
        }

        $workspaceInvitation = DB::transaction(function () use ($user, $storeWorkspaceInvitationRequestData, $workspace): WorkspaceInvitation {
            return WorkspaceInvitation::create([
                'workspace_id' => $workspace->id,
                'email' => $storeWorkspaceInvitationRequestData->email,
                'role' => $storeWorkspaceInvitationRequestData->role,
                'invited_by' => $user->id,
            ]);
        });

        $locale = $existingUser->locale ?? $user->locale;

        Mail::to($storeWorkspaceInvitationRequestData->email)
            ->locale($locale)
            ->send(new WorkspaceInvitationMail(invitation: $workspaceInvitation));

        return $workspaceInvitation;
    }
}
