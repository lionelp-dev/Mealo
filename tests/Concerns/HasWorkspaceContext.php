<?php

namespace Tests\Concerns;

use App\Actions\Workspace\WorkspaceInvitationStoreAction;
use App\Actions\Workspace\WorkspaceStoreAction;
use App\Data\Requests\Workspace\WorkspaceInvitationStoreRequestData;
use App\Data\Requests\Workspace\WorkspaceStoreRequestData;
use App\Models\Workspace;
use App\Models\WorkspaceInvitation;
use Carbon\CarbonImmutable;

trait HasWorkspaceContext
{
    public Workspace $personalWorkspace;

    public Workspace $sharedWorkspace;

    public Workspace $otherUserSharedWorkspace;

    public WorkspaceStoreRequestData $storePersonalWorkspaceRequestData;

    public WorkspaceStoreRequestData $storeSharedWorkspaceRequestData;

    public WorkspaceStoreRequestData $storeOtherUserSharedWorkspaceRequestData;

    public WorkspaceInvitation $sharedWorkspaceInvitation;

    public WorkspaceInvitation $sharedWorkspaceExpiredInvitation;

    public WorkspaceInvitationStoreRequestData $storeSharedWorkspaceInvitationRequestData;

    public WorkspaceInvitationStoreRequestData $storeSharedWorkspaceExpiredInvitationRequestData;

    public WorkspaceInvitationStoreRequestData $storeOtherSharedWorkspaceInvitationRequestData;

    public function setUpHasWorkspaceContext(): void
    {
        if (! isset($this->storePersonalWorkspaceRequestData)) {
            $this->storePersonalWorkspaceRequestData = WorkspaceStoreRequestData::from([
                'owner_id' => $this->user->id,
                'name' => 'any personal workspace',
                'is_personal' => true,
                'is_default' => false,
            ]);
        }

        if (! isset($this->storeSharedWorkspaceRequestData)) {
            $this->storeSharedWorkspaceRequestData = WorkspaceStoreRequestData::from([
                'owner_id' => $this->user->id,
                'name' => 'any shared workspace',
                'is_personal' => false,
                'is_default' => false,
            ]);
        }
    }

    public function setUpPersonalWorkspaceContext(): void
    {
        if (isset($this->personalWorkspace)) {
            return;
        }

        $this->personalWorkspace = app(WorkspaceStoreAction::class)->execute($this->user, $this->storePersonalWorkspaceRequestData);
    }

    public function setUpSharedWorkspaceContext(): void
    {
        if (isset($this->sharedWorkspace)) {
            return;
        }

        $this->setUpEditorUserContext();
        $this->setUpViewerUserContext();

        $this->sharedWorkspace = app(WorkspaceStoreAction::class)->execute($this->user, $this->storeSharedWorkspaceRequestData);

        $this->sharedWorkspace->users()->attach($this->editorUser->id, ['joined_at' => now()]);
        $this->sharedWorkspace->users()->attach($this->viewerUser->id, ['joined_at' => now()]);

        $this->sharedWorkspace->giveEditorPermissions($this->editorUser);
        $this->sharedWorkspace->giveViewerPermissions($this->viewerUser);
    }

    public function setUpOtherUserSharedWorkspaceContext(): void
    {
        if (isset($this->otherUserSharedWorkspace)) {
            return;
        }

        $this->setUpOtherUserContext();

        $this->storeOtherUserSharedWorkspaceRequestData = WorkspaceStoreRequestData::from([
            'owner_id' => $this->otherUser->id,
            'name' => 'any other user shared workspace',
            'is_personal' => false,
            'is_default' => false,
        ]);

        $this->otherUserSharedWorkspace = app(WorkspaceStoreAction::class)->execute($this->otherUser, $this->storeOtherUserSharedWorkspaceRequestData);
    }

    public function setUpStoreSharedWorkspaceInvitationRequestData(): void
    {
        if (isset($this->storeSharedWorkspaceInvitationRequestData)) {
            return;
        }

        $this->setUpSharedWorkspaceContext();
        $this->setUpInviteeUserContext();

        $this->storeSharedWorkspaceInvitationRequestData = WorkspaceInvitationStoreRequestData::from([
            'workspace_id' => $this->sharedWorkspace->id,
            'email' => $this->inviteeUser->email,
            'role' => 'editor',
            'invited_by' => $this->user->id,
        ]);
    }

    public function setUpStoreSharedWorkspaceExpiredInvitationRequestData(): void
    {
        if (isset($this->storeSharedWorkspaceExpiredInvitationRequestData)) {
            return;
        }

        $this->setUpSharedWorkspaceContext();
        $this->setUpOtherInviteeUserContext();

        $this->storeSharedWorkspaceExpiredInvitationRequestData = WorkspaceInvitationStoreRequestData::from([
            'workspace_id' => $this->sharedWorkspace->id,
            'email' => $this->otherInviteeUser->email,
            'role' => 'viewer',
            'invited_by' => $this->user->id,
        ]);
    }

    public function setUpStoreOtherSharedWorkspaceInvitationRequestData(): void
    {
        if (isset($this->storeOtherSharedWorkspaceInvitationRequestData)) {
            return;
        }

        $this->setUpSharedWorkspaceContext();
        $this->setUpThirdInviteeUserContext();

        $this->storeOtherSharedWorkspaceInvitationRequestData = WorkspaceInvitationStoreRequestData::from([
            'workspace_id' => $this->sharedWorkspace->id,
            'email' => $this->thirdInviteeUser->email,
            'role' => 'editor',
            'invited_by' => $this->user->id,
        ]);
    }

    public function setUpSharedWorkspaceInvitationContext(): void
    {
        if (isset($this->sharedWorkspaceInvitation)) {
            return;
        }

        $this->setUpStoreSharedWorkspaceInvitationRequestData();

        $this->sharedWorkspaceInvitation = app(WorkspaceInvitationStoreAction::class)
            ->execute($this->user, $this->sharedWorkspace, $this->storeSharedWorkspaceInvitationRequestData);
    }

    public function setUpSharedWorkspaceExpiredInvitationContext(): void
    {
        if (isset($this->sharedWorkspaceExpiredInvitation)) {
            return;
        }

        $this->setUpStoreSharedWorkspaceExpiredInvitationRequestData();

        $this->sharedWorkspaceExpiredInvitation = app(WorkspaceInvitationStoreAction::class)
            ->execute($this->user, $this->sharedWorkspace, $this->storeSharedWorkspaceExpiredInvitationRequestData);

        $this->sharedWorkspaceExpiredInvitation->expires_at = CarbonImmutable::now()->subHour();
        $this->sharedWorkspaceExpiredInvitation->save();
    }
}
