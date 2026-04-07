<?php

namespace App\Http\Controllers;

use App\Actions\Workspace\AcceptWorkspaceInvitationAction;
use App\Actions\Workspace\DeclineWorkspaceInvitationAction;
use App\Actions\Workspace\GetCurrentWorkspaceAction;
use App\Actions\Workspace\StoreWorkspaceInvitationAction;
use App\Data\Requests\Workspace\AcceptWorkspaceInvitationRequestData;
use App\Data\Requests\Workspace\DeclineWorkspaceInvitationRequestData;
use App\Data\Requests\Workspace\DeleteWorkspaceInvitationRequestData;
use App\Data\Requests\Workspace\StoreWorkspaceInvitationRequestData;
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
use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceInvitation;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Response;

class WorkspaceInvitationController extends Controller
{
    public function index(Request $request, GetCurrentWorkspaceAction $getCurrentWorkspaceAction): Response|RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        $currentWorkspace = $getCurrentWorkspaceAction($user);

        return inertia('workspaces/invitations', [
            'workspace_data' => [
                'workspaces_invitations' => WorkspaceInvitationResourceData::collect($user->workspacesInvitations),
                'current_workspace' => WorkspaceResourceData::from($currentWorkspace),
                'workspaces' => WorkspaceResourceData::collect($user->workspaces),
            ],
        ]);
    }

    public function store(
        Request $request,
        StoreWorkspaceInvitationRequestData $storeWorkspaceInvitationRequestData,
        StoreWorkspaceInvitationAction $storeWorkspaceInvitationAction
    ): RedirectResponse {
        try {
            /** @var User $user */
            $user = $request->user();

            $workspace = Workspace::where('id', $storeWorkspaceInvitationRequestData->workspace_id)->firstOrFail();

            Gate::authorize('invite', $workspace);

            $storeWorkspaceInvitationAction->execute($user, $workspace, $storeWorkspaceInvitationRequestData);

            return back()->with('success', (new InvitationSentMessage)->getMessage());
        } catch (
            MemberAlreadyExistWorkspaceException|
            AlreadyExistWorkspaceInvitationException|
            CannotInviteToWorkspaceException $e) {
                return back()->with('error', $e->getMessage());
            }
    }

    public function accept(
        Request $request,
        AcceptWorkspaceInvitationRequestData $acceptWorkspaceInvitationRequestData,
        AcceptWorkspaceInvitationAction $acceptWorkspaceInvitationAction
    ): RedirectResponse {
        try {
            /** @var User $user */
            $user = $request->user();

            $acceptWorkspaceInvitationAction->execute($user, $acceptWorkspaceInvitationRequestData);

            return back()->with('success', (new InvitationAcceptedMessage)->getMessage());
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
        Request $request,
        AcceptWorkspaceInvitationRequestData $acceptWorkspaceInvitationRequestData,
        AcceptWorkspaceInvitationAction $acceptWorkspaceInvitationAction
    ): RedirectResponse {
        try {
            $user = $request->user();

            if (! $user) {
                return redirect()->guest(route('login'));
            }

            $acceptWorkspaceInvitationAction->execute($user, $acceptWorkspaceInvitationRequestData);

            return redirect()->route('workspaces.index')
                ->with('success', (new InvitationAcceptedMessage)->getMessage());
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
        Request $request,
        DeclineWorkspaceInvitationRequestData $declineWorkspaceInvitationRequestData,
        DeclineWorkspaceInvitationAction $declineWorkspaceInvitationAction
    ): RedirectResponse {
        try {
            /** @var User $user */
            $user = $request->user();

            $declineWorkspaceInvitationAction->execute($user, $declineWorkspaceInvitationRequestData);

            return back()->with('success', (new InvitationDeclinedMessage)->getMessage());
        } catch (NotFoundWorkspaceInvitationException $e) {
            return back()->with('error', $e->getMessage());
        } catch (AuthorizationException $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function destroy(
        Request $request,
        DeleteWorkspaceInvitationRequestData $deleteWorkspaceInvitationRequestData
    ): RedirectResponse {
        try {
            $invitation = WorkspaceInvitation::where('id', $deleteWorkspaceInvitationRequestData->invitation)->firstOrFail();

            Gate::authorize('delete', $invitation);

            $invitation->delete();

            return back()->with(['success' => (new InvitationCancelledMessage)->getMessage()]);
        } catch (AuthorizationException $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
