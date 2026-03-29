<?php

namespace Tests\Concerns;

use App\Models\User;

trait HasUserContext
{
    public User $user;

    public User $otherUser;

    public function createUserContext()
    {
        $this->user = User::factory()->create();
        $this->otherUser = User::factory()->create();
    }
}
