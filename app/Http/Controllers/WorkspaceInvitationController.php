<?php

namespace App\Http\Controllers;

use App\Actions\Workspace\WorkspaceGetCurrentAction;
use App\Actions\Workspace\WorkspaceInvitationAcceptAction;
use App\Actions\Workspace\WorkspaceInvitationDeclineAction;
use App\Actions\Workspace\WorkspaceInvitationStoreAction;
use App\Data\Requests\Workspace\WorkspaceInvitationAcceptRequestData;
use App\Data\Requests\Workspace\WorkspaceInvitationDeclineRequestData;
use App\Data\Requests\Workspace\WorkspaceInvitationDeleteRequestData;
use App\Data\Requests\Workspace\WorkspaceInvitationStoreRequestData;
use App\Data\Resources\Workspace\Entities\WorkspaceInvitationResourceData;
use App\Data\Resources\Workspace\Entities\WorkspaceResourceData;
use App\Exceptions\WokspaceInvitation\AlreadyExistWorkspaceInvitationException;
use App\Exceptions\WokspaceInvitation\ExpiredWorkspaceInvitationException;
use App\Exceptions\WokspaceInvitation\NotFoundWorkspaceInvitationException;
use App\Exceptions\Workspace\CannotInviteToWorkspaceException;
use App\Exceptions\Workspace\MemberAlreadyExistWorkspaceException;
use App\Messages\WorkspaceInvitation\InvitationAcceptedMessage;
use App\Messages\WorkspaceInvitation\InvitationCancelledMessage;
use App\Messages\WorkspaceInvitation\InvitationDeclinedMessage;
use App\Messages\WorkspaceInvitation\InvitationSentMessage;
use App\Models\Workspace;
use App\Models\WorkspaceInvitation;
use App\Traits\AuthUser;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Response;

class WorkspaceInvitationController extends Controller
{
    use AuthUser;

    public function index(
        WorkspaceGetCurrentAction $getCurrentWorkspaceAction
    ): Response {
        $currentWorkspace = $getCurrentWorkspaceAction($this->user());

        return inertia('workspaces/invitations', [
            'workspace_data' => [
                'workspaces_invitations' => WorkspaceInvitationResourceData::collect($this->user()->workspacesInvitations),
                'current_workspace' => WorkspaceResourceData::from($currentWorkspace),
                'workspaces' => WorkspaceResourceData::collect($this->user()->workspaces),
            ],
        ]);
    }

    public function store(
        WorkspaceInvitationStoreRequestData $workspaceInvitationStoreRequestData,
        WorkspaceInvitationStoreAction $workspaceInvitationStoreAction
    ): RedirectResponse {
        try {
            $workspace = Workspace::where('id', $workspaceInvitationStoreRequestData->workspace_id)->firstOrFail();

            Gate::authorize('invite', $workspace);

            $workspaceInvitationStoreAction->execute($this->user(), $workspace, $workspaceInvitationStoreRequestData);

            return back()->with('success', (new InvitationSentMessage())->getMessage());
        } catch (
            MemberAlreadyExistWorkspaceException|
            AlreadyExistWorkspaceInvitationException|
            CannotInviteToWorkspaceException $e
        ) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function accept(
        WorkspaceInvitationAcceptRequestData $workspaceInvitationAcceptRequestData,
        WorkspaceInvitationAcceptAction $workspaceInvitationAcceptAction
    ): RedirectResponse {
        try {
            $workspaceInvitationAcceptAction->execute($this->user(), $workspaceInvitationAcceptRequestData);

            return back()->with('success', (new InvitationAcceptedMessage())->getMessage());
        } catch (
            ExpiredWorkspaceInvitationException|
            NotFoundWorkspaceInvitationException $e
        ) {
            return back()->with('error', $e->getMessage());
        } catch (AuthorizationException $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function acceptFromEmail(
        WorkspaceInvitationAcceptRequestData $workspaceInvitationAcceptRequestData,
        WorkspaceInvitationAcceptAction $workspaceInvitationAcceptAction
    ): RedirectResponse {
        try {
            $workspaceInvitationAcceptAction->execute($this->user(), $workspaceInvitationAcceptRequestData);

            return redirect()->route('workspaces.index')
                ->with('success', (new InvitationAcceptedMessage())->getMessage());
        } catch (
            ExpiredWorkspaceInvitationException|
            NotFoundWorkspaceInvitationException $e
        ) {
            return redirect()->route('workspaces.index')
                ->with('error', $e->getMessage());
        } catch (AuthorizationException $e) {
            return redirect()->route('workspaces.index')
                ->with('error', $e->getMessage());
        }
    }

    public function decline(
        WorkspaceInvitationDeclineRequestData $workspaceInvitationDeclineRequestData,
        WorkspaceInvitationDeclineAction $workspaceInvitationDeclineAction
    ): RedirectResponse {
        try {
            $workspaceInvitationDeclineAction->execute($this->user(), $workspaceInvitationDeclineRequestData);

            return back()->with('success', (new InvitationDeclinedMessage())->getMessage());
        } catch (NotFoundWorkspaceInvitationException $e) {
            return back()->with('error', $e->getMessage());
        } catch (AuthorizationException $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function destroy(
        WorkspaceInvitationDeleteRequestData $workspaceInvitationDeleteRequestData
    ): RedirectResponse {
        try {
            $invitation = WorkspaceInvitation::where(
                'id',
                $workspaceInvitationDeleteRequestData->invitation
            )->firstOrFail();

            Gate::authorize('delete', $invitation);

            $invitation->delete();

            return back()->with(['success' => (new InvitationCancelledMessage())->getMessage()]);
        } catch (AuthorizationException $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
