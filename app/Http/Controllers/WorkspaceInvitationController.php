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
use App\Exceptions\WorkspaceInvitation\WorkspaceInvitationAlreadyExistsException;
use App\Exceptions\WorkspaceInvitation\WorkspaceInvitationExpiredException;
use App\Exceptions\WorkspaceInvitation\WorkspaceInvitationNotFoundException;
use App\Exceptions\Workspace\WorkspaceInviteAuthorizationException;
use App\Exceptions\Workspace\WorkspaceMemberAlreadyExistsException;
use App\Http\Controllers\Concerns\HasAuthenticatedUser;
use App\Messages\WorkspaceInvitation\InvitationAcceptedMessage;
use App\Messages\WorkspaceInvitation\InvitationCancelledMessage;
use App\Messages\WorkspaceInvitation\InvitationDeclinedMessage;
use App\Messages\WorkspaceInvitation\InvitationSentMessage;
use App\Models\Workspace;
use App\Models\WorkspaceInvitation;
use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Response;

class WorkspaceInvitationController extends Controller
{
    use HasAuthenticatedUser;

    public function index(
        WorkspaceGetCurrentAction $getCurrentWorkspaceAction
    ): Response {
        $currentWorkspace = $getCurrentWorkspaceAction($this->authenticatedUser());

        return inertia('workspaces/invitations', [
            'workspace_data' => [
                'workspaces_invitations' => WorkspaceInvitationResourceData::collect($this->authenticatedUser()->workspacesInvitations),
                'current_workspace' => WorkspaceResourceData::from($currentWorkspace),
                'workspaces' => WorkspaceResourceData::collect($this->authenticatedUser()->workspaces),
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

            $workspaceInvitationStoreAction->execute($this->authenticatedUser(), $workspace, $workspaceInvitationStoreRequestData);

            return back()->with('success', InvitationSentMessage::message());
        } catch (
            WorkspaceMemberAlreadyExistsException|
            WorkspaceInvitationAlreadyExistsException|
            WorkspaceInviteAuthorizationException $e
        ) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function accept(
        WorkspaceInvitationAcceptRequestData $workspaceInvitationAcceptRequestData,
        WorkspaceInvitationAcceptAction $workspaceInvitationAcceptAction
    ): RedirectResponse {
        try {
            $workspaceInvitationAcceptAction->execute($this->authenticatedUser(), $workspaceInvitationAcceptRequestData);

            return back()->with('success', InvitationAcceptedMessage::message());
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function acceptFromEmail(
        WorkspaceInvitationAcceptRequestData $workspaceInvitationAcceptRequestData,
        WorkspaceInvitationAcceptAction $workspaceInvitationAcceptAction
    ): RedirectResponse {
        try {
            $workspaceInvitationAcceptAction->execute($this->authenticatedUser(), $workspaceInvitationAcceptRequestData);

            return redirect()->route('workspaces.index')
                ->with('success', InvitationAcceptedMessage::message());
        } catch (
            WorkspaceInvitationExpiredException|
            WorkspaceInvitationNotFoundException|
            AuthorizationException $e
        ) {
            return redirect()->route('workspaces.index')
                ->with('error', $e->getMessage());
        }
    }

    public function decline(
        WorkspaceInvitationDeclineRequestData $workspaceInvitationDeclineRequestData,
        WorkspaceInvitationDeclineAction $workspaceInvitationDeclineAction
    ): RedirectResponse {
        try {
            $workspaceInvitationDeclineAction->execute($this->authenticatedUser(), $workspaceInvitationDeclineRequestData);

            return back()->with('success', InvitationDeclinedMessage::message());
        } catch (
            WorkspaceInvitationNotFoundException
            |AuthorizationException $e
        ) {
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

            return back()->with(['success' => InvitationCancelledMessage::message()]);
        } catch (AuthorizationException $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
