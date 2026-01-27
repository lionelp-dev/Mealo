<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWorkspace;
use App\Http\Requests\UpdateWorkspace;
use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceInvitation;
use App\Services\WorkspaceDataService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class WorkspaceController extends Controller
{
    public function __construct(
        private WorkspaceDataService $workspaceDataService
    ) {}

    public function index(Request $request)
    {
        $user = $request->user();
        $workspaceData = $this->workspaceDataService->getWorkspaceDataForUser($user);

        return Inertia::render('workspaces/index', [
            'workspace_data' => $workspaceData,
        ]);
    }

    public function store(StoreWorkspace $request)
    {
        return DB::transaction(function () use ($request) {
            $workspace = Workspace::create([
                'name' => $request->validated('name'),
                'description' => $request->validated('description'),
                'owner_id' => $request->user()->id,
                'is_personal' => false,
            ]);

            return back()->with('success', 'Workspace created successfully');
        });
    }

    public function update(UpdateWorkspace $request, Workspace $workspace)
    {
        Gate::authorize('update', $workspace);

        $workspace->update($request->validated());

        return back()->with('success', 'Workspace updated successfully');
    }

    public function destroy(Workspace $workspace)
    {
        Gate::authorize('delete', $workspace);

        $workspace->delete();

        return back()->with('success', 'Workspace deleted successfully');
    }

    public function switch(Request $request, Workspace $workspace)
    {
        Gate::authorize('view', $workspace);

        // Store current workspace in session
        session(['current_workspace_id' => $workspace->id]);

        return back()->with('success', 'Workspace switched successfully');
    }

    public function removeMember(Request $request, Workspace $workspace)
    {
        Gate::authorize('manageMember', $workspace);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        // Cannot remove owner
        if ($validated['user_id'] === $workspace->owner_id) {
            return response()->json(['message' => 'Cannot remove workspace owner'], 403);
        }

        $user = User::find($validated['user_id']);

        // Remove Spatie permissions
        $workspace->removeUserPermissions($user);

        // Remove from pivot table (membership tracking only)
        $workspace->users()->detach($validated['user_id']);

        return back()->with(['message' => 'Member removed successfully']);
    }

    public function updateMemberRole(Request $request, Workspace $workspace)
    {
        Gate::authorize('manageMember', $workspace);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'required|in:editor,viewer',
        ]);

        // Cannot change owner role
        if ($validated['user_id'] === $workspace->owner_id) {
            return response()->json(['message' => 'Cannot change owner role'], 403);
        }

        $user = User::find($validated['user_id']);

        // Remove old permissions
        $workspace->removeUserPermissions($user);

        // Give new permissions based on role
        match ($validated['role']) {
            'editor' => $workspace->giveEditorPermissions($user),
            'viewer' => $workspace->giveViewerPermissions($user),
        };

        return back()->with(['message' => 'Member role updated successfully']);
    }

    /**
     * Leave a workspace (for non-owner members).
     */
    public function leave(Request $request, Workspace $workspace)
    {
        $user = $request->user();

        // Owner cannot leave their own workspace
        if ($workspace->owner_id === $user->id) {
            return back()->with('error', 'Le propriétaire ne peut pas quitter son propre groupe.');
        }

        // Check if user is a member
        if (!$workspace->hasUser($user)) {
            return back()->with('error', 'Vous n\'êtes pas membre de ce groupe.');
        }

        // Remove permissions
        $workspace->removeUserPermissions($user);

        // Remove from pivot table
        $workspace->users()->detach($user->id);

        return back()->with('success', 'Vous avez quitté le groupe.');
    }
}
