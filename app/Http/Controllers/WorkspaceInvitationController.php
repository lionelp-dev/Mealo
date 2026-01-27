<?php

namespace App\Http\Controllers;

use App\Mail\WorkspaceInvitationMail;
use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceInvitation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;

class WorkspaceInvitationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $pendingInvitations = WorkspaceInvitation::with([
            'workspace' => function ($query) {
                $query->withCount('users');
            },
            'invitedBy',
        ])
            ->where('email', $user->email)
            ->where('expires_at', '>', now())
            ->orderBy('created_at', 'desc')
            ->get();

        return inertia('workspaces/invitations', [
            'pending_invitations' => $pendingInvitations,
            'workspace_data' => app(\App\Services\WorkspaceDataService::class)->getWorkspaceDataForUser($user),
        ]);
    }

    public function store(Request $request, Workspace $workspace)
    {
        Gate::authorize('invite', $workspace);

        $validated = $request->validate([
            'email' => [
                'required',
                'email',
                Rule::unique('workspace_invitations')->where(function ($query) use ($workspace) {
                    return $query->where('workspace_id', $workspace->id)
                        ->where('expires_at', '>', now());
                }),
            ],
            'role' => 'required|in:editor,viewer',
        ]);

        // Check if user is already a member
        $existingUser = User::where('email', $validated['email'])->first();
        if ($existingUser && $workspace->hasUser($existingUser)) {
            return response()->json(['message' => 'User is already a member of this workspace'], 409);
        }

        $invitation = WorkspaceInvitation::create([
            'workspace_id' => $workspace->id,
            'email' => $validated['email'],
            'role' => $validated['role'],
            'invited_by' => $request->user()->id,
        ]);

        Mail::to($validated['email'])->send(new WorkspaceInvitationMail(invitation: $invitation));

        return back()->with('success', 'Invitation sent successfully');
    }

    public function accept(Request $request, $token)
    {
        $invitation = WorkspaceInvitation::where('token', $token)->firstOrFail();
        if (!$invitation->isValid()) {
            return response()->json(['message' => 'Invitation expired or invalid'], 410);
        }

        $user = $request->user();

        if ($invitation->accept($user)) {
            return response()->json(['message' => 'Invitation accepted successfully']);
        }

        return back()->with(['message' => 'Failed to accept invitation'], 400);
    }

    public function decline(Request $request, $token)
    {
        $invitation = WorkspaceInvitation::where('token', $token)->firstOrFail();

        // Only the invited user can decline
        if ($request->user()->email !== $invitation->email) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $invitation->delete();

        return back()->with(['message' => 'Invitation declined']);
    }

    /**
     * Accept invitation for authenticated users (in-app).
     */
    public function acceptAuthenticated(Request $request, WorkspaceInvitation $invitation)
    {
        $user = $request->user();

        // Verify the invitation belongs to the authenticated user
        if ($user->email !== $invitation->email) {
            return back()->with('error', 'Cette invitation ne vous est pas destinée.');
        }

        if (!$invitation->isValid()) {
            return back()->with('error', 'Cette invitation a expiré ou n\'est plus valide.');
        }

        if ($invitation->accept($user)) {
            return back()->with('success', 'Invitation acceptée avec succès.');
        }

        return back()->with('error', 'Impossible d\'accepter l\'invitation.');
    }

    /**
     * Decline invitation for authenticated users (in-app).
     */
    public function declineAuthenticated(Request $request, WorkspaceInvitation $invitation)
    {
        $user = $request->user();

        // Verify the invitation belongs to the authenticated user
        if ($user->email !== $invitation->email) {
            return back()->with('error', 'Cette invitation ne vous est pas destinée.');
        }

        $invitation->delete();

        return back()->with('success', 'Invitation déclinée.');
    }

    public function destroy(WorkspaceInvitation $invitation)
    {
        Gate::authorize('invite', $invitation->workspace);

        $invitation->delete();

        return back()->with(['message' => 'Invitation cancelled']);
    }
}
