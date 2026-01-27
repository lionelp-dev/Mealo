<?php

namespace App\Services;

use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceInvitation;

class WorkspaceDataService
{
    /**
     * Get current workspace from session or fallback to personal workspace.
     * If the user no longer has access to the workspace in session, automatically
     * switches to their personal workspace and displays a warning message.
     */
    public function getCurrentWorkspace(User $user): Workspace
    {
        $currentWorkspaceId = session('current_workspace_id');

        if ($currentWorkspaceId) {
            $currentWorkspace = $user->workspaces()
                ->where('workspaces.id', $currentWorkspaceId)
                ->first();

            // User found in workspace, return it
            if ($currentWorkspace) {
                return $currentWorkspace;
            }

            // Check if workspace exists but user doesn't have access anymore
            $workspace = Workspace::find($currentWorkspaceId);
            if ($workspace && !$workspace->is_personal) {
                // User no longer has access to this workspace
                $personalWorkspace = $user->getPersonalWorkspace();
                session(['current_workspace_id' => $personalWorkspace->id]);
                session()->flash('warning', 'You no longer have access to this workspace. Switched to your personal workspace.');
                return $personalWorkspace;
            }
        }

        // No workspace in session or workspace not found, fallback to personal workspace
        $personalWorkspace = $user->getPersonalWorkspace();
        session(['current_workspace_id' => $personalWorkspace->id]);
        return $personalWorkspace;
    }

    /**
     * Get complete workspace data bundle for frontend.
     */
    public function getWorkspaceDataForUser(User $user): array
    {
        $currentWorkspace = $this->getCurrentWorkspace($user);

        return [
            'current_workspace' => $this->formatWorkspace($currentWorkspace),
            'workspaces' => $this->getFormattedWorkspaces($user),
            'pending_invitations' => $this->getPendingInvitationsForUser($user),
        ];
    }

    /**
     * Format a workspace with members and invitations.
     */
    public function formatWorkspace(Workspace $workspace): Workspace
    {
        $workspace->users_count = $workspace->users()->count();
        $workspace->members = $this->formatMembers($workspace);
        $workspace->pending_invitations = $this->formatInvitations($workspace);

        return $workspace;
    }

    /**
     * Get formatted list of accessible workspaces.
     */
    private function getFormattedWorkspaces(User $user): \Illuminate\Support\Collection
    {
        $workspaces = $user->getAccessibleWorkspaces();

        foreach ($workspaces as $workspace) {
            $workspace->users_count = $workspace->users()->count();
            $workspace->members = $this->formatMembersForWorkspace($workspace);
            $workspace->pending_invitations = $this->formatInvitations($workspace);
        }
        return $workspaces;
    }

    /**
     * Format workspace members with roles.
     */
    private function formatMembers(Workspace $workspace): array
    {
        return $workspace->users()
            ->withPivot('joined_at')
            ->get()
            ->map(fn($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $workspace->getUserRole($user),
                'joined_at' => $user->pivot->joined_at,
            ])
            ->toArray();
    }

    /**
     * Format workspace members using a reference workspace for roles.
     */
    private function formatMembersForWorkspace(Workspace $workspace): array
    {
        return $workspace->users()
            ->withPivot('joined_at')
            ->get()
            ->map(fn($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $workspace->getUserRole($user),
                'joined_at' => $user->pivot->joined_at,
            ])
            ->toArray();
    }

    /**
     * Format workspace invitations.
     */
    private function formatInvitations(Workspace $workspace): array
    {
        return $workspace->invitations()
            ->where('expires_at', '>', now())
            ->with('invitedBy:id,name')
            ->get()
            ->map(fn($invitation) => [
                'id' => $invitation->id,
                'email' => $invitation->email,
                'role' => $invitation->role,
                'expires_at' => $invitation->expires_at,
                'invited_by' => [
                    'name' => $invitation->invitedBy->name,
                ],
            ])
            ->toArray();
    }

    /**
     * Get workspace data for user with a specific workspace.
     * This is useful when workspace is determined by request parameters.
     */
    public function getWorkspaceDataForUserWithSpecificWorkspace(User $user, Workspace $specificWorkspace): array
    {
        return [
            'current_workspace' => $this->formatWorkspace($specificWorkspace),
            'workspaces' => $user->getAccessibleWorkspaces(),
            'pending_invitations' => $this->getPendingInvitationsForUser($user),
        ];
    }

    /**
     * Get pending invitations for a user.
     */
    private function getPendingInvitationsForUser(User $user): \Illuminate\Support\Collection
    {
        return WorkspaceInvitation::query()->where('email', $user->email)
            ->where('expires_at', '>', now())
            ->with(['workspace','invitedBy'])
            ->get();
    }
}
