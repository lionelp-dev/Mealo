<?php

namespace App\Http\Controllers;

use App\Actions\Workspace\WorkspaceDeleteAction;
use App\Actions\Workspace\WorkspaceGetCurrentAction;
use App\Actions\Workspace\WorkspaceMemberDeleteAction;
use App\Actions\Workspace\WorkspaceMemberRoleUpdateAction;
use App\Actions\Workspace\WorkspaceStoreAction;
use App\Actions\Workspace\WorkspaceUpdateAction;
use App\Data\Requests\Workspace\WorkspaceMemberDeleteRequestData;
use App\Data\Requests\Workspace\WorkspaceMemberRoleUpdateRequestData;
use App\Data\Requests\Workspace\WorkspaceStoreRequestData;
use App\Data\Requests\Workspace\WorkspaceUpdateRequestData;
use App\Data\Resources\Workspace\Entities\WorkspaceInvitationResourceData;
use App\Data\Resources\Workspace\Entities\WorkspaceResourceData;
use App\Messages\Workspace\MemberRemovedMessage;
use App\Messages\Workspace\MemberRoleUpdatedMessage;
use App\Messages\Workspace\WorkspaceCreatedMessage;
use App\Messages\Workspace\WorkspaceDeletedMessage;
use App\Messages\Workspace\WorkspaceLeftMessage;
use App\Messages\Workspace\WorkspaceSwitchedMessage;
use App\Messages\Workspace\WorkspaceUpdatedMessage;
use App\Models\Workspace;
use App\Traits\AuthUser;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class WorkspaceController extends Controller
{
    use AuthUser;

    public function __construct() {}

    public function index(
        WorkspaceGetCurrentAction $workspaceGetCurrentAction
    ): Response {
        $currentWorkspace = $workspaceGetCurrentAction($this->user());

        return Inertia::render('workspaces/index', [
            'workspace_data' => [
                'workspaces_invitations' => WorkspaceInvitationResourceData::collect($this->user()->workspacesInvitations),
                'current_workspace' => WorkspaceResourceData::from($currentWorkspace),
                'workspaces' => WorkspaceResourceData::collect($this->user()->workspaces),
            ],
        ]);
    }

    public function store(
        WorkspaceStoreRequestData $workspaceStoreRequestData,
        WorkspaceStoreAction $workspaceStoreAction
    ): RedirectResponse {
        $workspace = $workspaceStoreAction->execute($this->user(), $workspaceStoreRequestData);

        return back()->with([
            'success' => (new WorkspaceCreatedMessage())->getMessage(),
            'new_workspace_id' => $workspace->id,
        ]);
    }

    public function update(
        Workspace $workspace,
        WorkspaceUpdateRequestData $workspaceUpdateRequestData,
        WorkspaceUpdateAction $workspaceUpdateAction
    ): RedirectResponse {
        try {
            Gate::authorize('update', $workspace);

            $workspaceUpdateAction->execute($workspace, $workspaceUpdateRequestData);

            return back()->with('success', (new WorkspaceUpdatedMessage())->getMessage());
        } catch (AuthorizationException $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function updateMemberRole(
        Workspace $workspace,
        WorkspaceMemberRoleUpdateRequestData $workspaceMemberRoleUpdateRequestData,
        WorkspaceMemberRoleUpdateAction $workspaceMemberRoleUpdateAction
    ): RedirectResponse {
        try {
            Gate::authorize('manageMember', $workspace);

            $workspaceMemberRoleUpdateAction->execute($workspace, $workspaceMemberRoleUpdateRequestData);

            return back()->with(['success' => (new MemberRoleUpdatedMessage())->getMessage()]);
        } catch (AuthorizationException $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function switch(
        Workspace $workspace
    ): RedirectResponse {
        try {
            Gate::authorize('view', $workspace);

            session(['current_workspace_id' => $workspace->id]);

            return back()->with('success', (new WorkspaceSwitchedMessage())->getMessage());
        } catch (AuthorizationException $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function removeMember(
        Workspace $workspace,
        WorkspaceMemberDeleteRequestData $workspaceMemberDeleteRequestData,
        WorkspaceMemberDeleteAction $workspaceMemberDeleteAction
    ): RedirectResponse {
        try {
            Gate::authorize('manageMember', $workspace);

            $workspaceMemberDeleteAction->execute($workspace, $workspaceMemberDeleteRequestData);

            return back()->with(['success' => (new MemberRemovedMessage())->getMessage()]);
        } catch (AuthorizationException $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function leave(
        Workspace $workspace,
        WorkspaceMemberDeleteAction $workspaceMemberDeleteAction
    ): RedirectResponse {
        try {
            $workspaceMemberDeleteAction->execute(
                $workspace,
                WorkspaceMemberDeleteRequestData::from(
                    [
                        'user_id' => $this->user()->id,
                    ]
                )
            );

            return back()->with('success', (new WorkspaceLeftMessage())->getMessage());
        } catch (AuthorizationException $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function destroy(
        Workspace $workspace,
        WorkspaceDeleteAction $workspaceDeleteAction
    ): RedirectResponse {
        try {
            Gate::authorize('delete', $workspace);

            $workspaceDeleteAction->execute($workspace);

            return back()->with('success', (new WorkspaceDeletedMessage())->getMessage());
        } catch (AuthorizationException $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
