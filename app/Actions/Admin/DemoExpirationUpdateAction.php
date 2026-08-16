<?php

namespace App\Actions\Admin;

use App\Models\User;
use Carbon\CarbonImmutable;

class DemoExpirationUpdateAction
{
    /**
     * Update the expiration date of a user's demo account.
     */
    public function execute(User $user, CarbonImmutable $expiresAt): void
    {
        $user->demoAccount()->update(['expires_at' => $expiresAt]);
    }
}
