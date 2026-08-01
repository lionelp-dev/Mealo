<?php

namespace Tests\Concerns;

use App\Models\User;

trait HasUserContext
{
    public User $user;

    public User $otherUser;

    public User $thirdUser;

    public User $ownerUser;

    public User $editorUser;

    public User $viewerUser;

    public User $inviteeUser;

    public User $otherInviteeUser;

    public User $thirdInviteeUser;

    public function setUpHasUserContext(): void
    {
        if (isset($this->user)) {
            return;
        }

        $this->user = User::factory()->create();
    }

    public function setUpOtherUserContext(): void
    {
        if (isset($this->otherUser)) {
            return;
        }

        $this->otherUser = User::factory()->create();
    }

    public function setUpThirdUserContext(): void
    {
        if (isset($this->thirdUser)) {
            return;
        }

        $this->thirdUser = User::factory()->create();
    }

    public function setUpEditorUserContext(): void
    {
        if (isset($this->editorUser)) {
            return;
        }

        $this->editorUser = User::factory()->create();
    }

    public function setUpViewerUserContext(): void
    {
        if (isset($this->viewerUser)) {
            return;
        }

        $this->viewerUser = User::factory()->create();
    }

    public function setUpInviteeUserContext(): void
    {
        if (isset($this->inviteeUser)) {
            return;
        }

        $this->inviteeUser = User::factory()->create();
    }

    public function setUpOtherInviteeUserContext(): void
    {
        if (isset($this->otherInviteeUser)) {
            return;
        }

        $this->otherInviteeUser = User::factory()->create();
    }

    public function setUpThirdInviteeUserContext(): void
    {
        if (isset($this->thirdInviteeUser)) {
            return;
        }

        $this->thirdInviteeUser = User::factory()->create();
    }
}
