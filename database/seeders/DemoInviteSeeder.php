<?php

namespace Database\Seeders;

use App\Models\DemoInvite;
use Illuminate\Database\Seeder;

class DemoInviteSeeder extends Seeder
{
    /**
     * Seed the single demo share-link invite from configuration.
     */
    public function run(): void
    {
        $token = config('demo.token');

        if (! is_string($token) || $token === '') {
            return;
        }

        $expiresAt = config('demo.link_expires_at');

        DemoInvite::query()->updateOrCreate(
            ['token' => $token],
            [
                'label' => 'CV share link',
                'max_uses' => config('demo.max_uses', 50),
                'expires_at' => is_string($expiresAt) && $expiresAt !== '' ? $expiresAt : null,
                'is_active' => true,
            ]
        );
    }
}
