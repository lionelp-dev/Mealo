<?php

namespace Tests\Concerns;

use App\Actions\Workspace\StoreWorkspaceAction;
use App\Actions\Workspace\StoreWorkspaceInvitationAction;
use App\Data\Requests\Workspace\StoreWorkspaceInvitationRequestData;
use App\Data\Requests\Workspace\StoreWorkspaceRequestData;
use App\Models\Workspace;
use App\Models\WorkspaceInvitation;
use App\Policies\WorkspacePolicy;
use Carbon\CarbonImmutable;

trait HasWorkspaceContext
{
    public WorkspacePolicy $workspacePolicy;

    public Workspace $defaultWorkspace;

    public Workspace $personalWorkspace;

    public Workspace $sharedWorkspace;

    public Workspace $otherUserSharedWorkspace;

    public StoreWorkspaceRequestData $storePersonalWorkspaceRequestData;

    public StoreWorkspaceRequestData $storeSharedWorkspaceRequestData;

    public StoreWorkspaceRequestData $storeOtherUserSharedWorkspaceRequestData;

    public WorkspaceInvitation $sharedWorkspaceInvitation;

    public WorkspaceInvitation $sharedWorkspaceExpiredInvitation;

    public StoreWorkspaceInvitationRequestData $storeSharedWorkspaceInvitationRequestData;

    public StoreWorkspaceInvitationRequestData $storeOtherSharedWorkspaceInvitationRequestData;

    public function setUpHasWorkspaceContext(): void
    {
        $this->defaultWorkspace = $this->user->workspaces()
            ->where('is_personal', true)
            ->where('is_default', true)
            ->first();

        $this->storePersonalWorkspaceRequestData = StoreWorkspaceRequestData::from([
            'owner_id' => $this->user->id,
            'name' => 'any personal workspace',
            'is_personal' => true,
            'is_default' => false,
        ]);

        $this->storeSharedWorkspaceRequestData = StoreWorkspaceRequestData::from([
            'owner_id' => $this->user->id,
            'name' => 'any shared workspace',
            'is_personal' => false,
            'is_default' => false,
        ]);

        $this->storeOtherUserSharedWorkspaceRequestData = StoreWorkspaceRequestData::from([
            'owner_id' => $this->otherUser->id,
            'name' => 'any other user shared workspace',
            'is_personal' => false,
            'is_default' => false,
        ]);

        $this->personalWorkspace = app(StoreWorkspaceAction::class)->execute($this->user, $this->storePersonalWorkspaceRequestData);

        $this->sharedWorkspace = app(StoreWorkspaceAction::class)->execute($this->user, $this->storeSharedWorkspaceRequestData);

        $this->otherUserSharedWorkspace = app(StoreWorkspaceAction::class)->execute($this->otherUser, $this->storeOtherUserSharedWorkspaceRequestData);

        $this->sharedWorkspace->users()->attach($this->editorUser->id, ['joined_at' => now()]);
        $this->sharedWorkspace->users()->attach($this->viewerUser->id, ['joined_at' => now()]);

        $this->sharedWorkspace->giveEditorPermissions($this->editorUser);
        $this->sharedWorkspace->giveViewerPermissions($this->viewerUser);

        $this->storeSharedWorkspaceInvitationRequestData = StoreWorkspaceInvitationRequestData::from(
            [
                'workspace_id' => $this->sharedWorkspace->id,
                'email' => $this->inviteeUser->email,
                'role' => 'editor',
                'invited_by' => $this->user->id,
            ]
        );

        $this->storeSharedWorkspaceExpiredInvitationRequestData = StoreWorkspaceInvitationRequestData::from(
            [
                'workspace_id' => $this->sharedWorkspace->id,
                'email' => $this->otherInviteeUser->email,
                'role' => 'viewer',
                'invited_by' => $this->user->id,
            ]
        );

        $this->storeOtherSharedWorkspaceInvitationRequestData = StoreWorkspaceInvitationRequestData::from(
            [
                'workspace_id' => $this->sharedWorkspace->id,
                'email' => $this->thirdInviteeUser->email,
                'role' => 'editor',
                'invited_by' => $this->user->id,
            ]
        );

        $this->sharedWorkspaceInvitation = app(StoreWorkspaceInvitationAction::class)
            ->execute($this->user, $this->sharedWorkspace, $this->storeSharedWorkspaceInvitationRequestData);

        $this->sharedWorkspaceExpiredInvitation = app(StoreWorkspaceInvitationAction::class)
            ->execute($this->user, $this->sharedWorkspace, $this->storeSharedWorkspaceExpiredInvitationRequestData);

        $this->sharedWorkspaceExpiredInvitation->expires_at = CarbonImmutable::now()->subHour();
        $this->sharedWorkspaceExpiredInvitation->save();
    }
}
