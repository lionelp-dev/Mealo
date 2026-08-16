<?php

namespace App\Actions\Demo;

use App\Models\DemoInvite;
use App\Models\User;
use Illuminate\Support\Str;

class DemoAccountCreateAction
{
    /**
     * Create a fresh, isolated demo account.
     *
     * The account has no usable password (login happens via the demo_token
     * reconnect link) and auto-expires after the configured number of days.
     * The User::booted() hook creates the personal workspace automatically.
     */
    public function execute(?DemoInvite $invite = null): User
    {
        $accountDays = config('demo.account_days', 30);
        $accountDays = is_numeric($accountDays) ? (int) $accountDays : 30;

        $user = User::create([
            'name' => 'Invité démo',
            'email' => 'demo-'.Str::uuid().'@demo.local',
            'password' => Str::random(40),
            'email_verified_at' => now(),
        ]);

        $user->demoAccount()->create([
            'demo_invite_id' => $invite?->id,
            'token' => (string) Str::uuid(),
            'expires_at' => now()->addDays($accountDays),
        ]);

        return $user;
    }
}
