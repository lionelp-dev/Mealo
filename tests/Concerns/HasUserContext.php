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

    public function setUpHasUserContext()
    {
        $this->user = User::factory()->create();
        $this->otherUser = User::factory()->create();
        $this->thirdUser = User::factory()->create();
        $this->editorUser = User::factory()->create();
        $this->viewerUser = User::factory()->create();
        $this->inviteeUser = User::factory()->create();
        $this->otherInviteeUser = User::factory()->create();
        $this->thirdInviteeUser = User::factory()->create();
    }
}
