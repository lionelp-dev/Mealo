<?php

namespace App\Http\Controllers;

use App\Actions\Workspace\DeleteWorkspaceAction;
use App\Actions\Workspace\DeleteWorkspaceMemberAction;
use App\Actions\Workspace\GetCurrentWorkspaceAction;
use App\Actions\Workspace\StoreWorkspaceAction;
use App\Actions\Workspace\UpdateWorkspaceAction;
use App\Actions\Workspace\UpdateWorkspaceMemberRoleAction;
use App\Data\Requests\Workspace\DeleteWorkspaceMemberRequestData;
use App\Data\Requests\Workspace\StoreWorkspaceRequestData;
use App\Data\Requests\Workspace\UpdateWorkspaceMemberRoleRequestData;
use App\Data\Requests\Workspace\UpdateWorkspaceRequestData;
use App\Data\Resources\Workspace\Entities\WorkspaceInvitationResourceData;
use App\Data\Resources\Workspace\Entities\WorkspaceResourceData;
use App\Messages\Workspace\MemberRemovedMessage;
use App\Messages\Workspace\MemberRoleUpdatedMessage;
use App\Messages\Workspace\WorkspaceCreatedMessage;
use App\Messages\Workspace\WorkspaceDeletedMessage;
use App\Messages\Workspace\WorkspaceLeftMessage;
use App\Messages\Workspace\WorkspaceSwitchedMessage;
use App\Messages\Workspace\WorkspaceUpdatedMessage;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class WorkspaceController extends Controller
{
    public function __construct() {}

    public function index(
        Request $request,
        GetCurrentWorkspaceAction $getCurrentWorkspaceAction
    ): Response|RedirectResponse {
        /** @var User $user */
        $user = $request->user();

        $currentWorkspace = $getCurrentWorkspaceAction($user);

        return Inertia::render('workspaces/index', [
            'workspace_data' => [
                'workspaces_invitations' => WorkspaceInvitationResourceData::collect($user->workspacesInvitations),
                'current_workspace' => WorkspaceResourceData::from($currentWorkspace),
                'workspaces' => WorkspaceResourceData::collect($user->workspaces),
            ],
        ]);
    }

    public function store(
        Request $request,
        StoreWorkspaceRequestData $storeWorkspaceRequestData,
        StoreWorkspaceAction $storeWorkspaceAction
    ): RedirectResponse {
        /** @var User $user */
        $user = $request->user();

        $workspace = $storeWorkspaceAction->execute($user, $storeWorkspaceRequestData);

        return back()->with([
            'success' => (new WorkspaceCreatedMessage)->getMessage(),
            'new_workspace_id' => $workspace->id,
        ]);
    }

    public function update(
        Request $request,
        Workspace $workspace,
        UpdateWorkspaceRequestData $updateWorkspaceRequestData,
        UpdateWorkspaceAction $updateWorkspaceAction
    ): RedirectResponse {
        try {
            Gate::authorize('update', $workspace);

            $updateWorkspaceAction->execute($workspace, $updateWorkspaceRequestData);

            return back()->with('success', (new WorkspaceUpdatedMessage)->getMessage());
        } catch (AuthorizationException $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function updateMemberRole(
        Workspace $workspace,
        UpdateWorkspaceMemberRoleRequestData $roleData,
        UpdateWorkspaceMemberRoleAction $updateWorkspaceMemberRoleAction
    ): RedirectResponse {
        try {
            Gate::authorize('manageMember', $workspace);

            $updateWorkspaceMemberRoleAction->execute($workspace, $roleData);

            return back()->with(['success' => (new MemberRoleUpdatedMessage)->getMessage()]);
        } catch (AuthorizationException $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function switch(Request $request, Workspace $workspace): RedirectResponse
    {
        try {
            Gate::authorize('view', $workspace);

            session(['current_workspace_id' => $workspace->id]);

            return back()->with('success', (new WorkspaceSwitchedMessage)->getMessage());
        } catch (AuthorizationException $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function removeMember(
        Workspace $workspace,
        DeleteWorkspaceMemberRequestData $deleteWorkspaceMemberData,
        DeleteWorkspaceMemberAction $deleteWorkspaceMemberAction
    ): RedirectResponse {
        try {
            Gate::authorize('manageMember', $workspace);

            $deleteWorkspaceMemberAction->execute($workspace, $deleteWorkspaceMemberData);

            return back()->with(['success' => (new MemberRemovedMessage)->getMessage()]);
        } catch (AuthorizationException $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function leave(
        Request $request,
        Workspace $workspace,
        DeleteWorkspaceMemberAction $deleteWorkspaceMemberAction
    ): RedirectResponse {
        /** @var User $user */
        $user = $request->user();

        try {
            $deleteWorkspaceMemberAction->execute(
                $workspace,
                DeleteWorkspaceMemberRequestData::from(
                    [
                        'user_id' => $user->id,
                    ]
                )
            );

            return back()->with('success', (new WorkspaceLeftMessage)->getMessage());
        } catch (AuthorizationException $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function destroy(Workspace $workspace, DeleteWorkspaceAction $deleteWorkspaceAction): RedirectResponse
    {
        try {
            Gate::authorize('delete', $workspace);

            $deleteWorkspaceAction->execute($workspace);

            return back()->with('success', (new WorkspaceDeletedMessage)->getMessage());
        } catch (AuthorizationException $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
