<?php

use App\Models\BetaRequest;
use App\Models\User;

describe('Beta Cleanup Expired Command', function () {
    it('deletes expired beta users', function () {
        // Create expired beta user
        $user = User::factory()->create(['email' => 'expired@example.com']);
        $betaRequest = BetaRequest::factory()->converted()->create([
            'email' => 'expired@example.com',
            'user_id' => $user->id,
            'account_expires_at' => now()->subDay(),
        ]);

        $this->artisan('beta:cleanup-expired')
            ->assertExitCode(0);

        // User should be deleted
        expect(User::find($user->id))->toBeNull();

        // Beta request should be marked as expired
        $betaRequest->refresh();
        expect($betaRequest->status)->toBe('expired')
            ->and($betaRequest->user_id)->toBeNull(); // Foreign key set to null on delete
    });

    it('does not delete non-expired beta users', function () {
        $user = User::factory()->create(['email' => 'active@example.com']);
        $betaRequest = BetaRequest::factory()->converted()->create([
            'email' => 'active@example.com',
            'user_id' => $user->id,
            'account_expires_at' => now()->addDays(10),
        ]);

        $this->artisan('beta:cleanup-expired')
            ->assertExitCode(0);

        // User should still exist
        expect(User::find($user->id))->not->toBeNull();

        // Beta request should still be converted
        $betaRequest->refresh();
        expect($betaRequest->status)->toBe('converted');
    });

    it('handles multiple expired users', function () {
        $user1 = User::factory()->create(['email' => 'expired1@example.com']);
        $user2 = User::factory()->create(['email' => 'expired2@example.com']);

        BetaRequest::factory()->converted()->create([
            'email' => 'expired1@example.com',
            'user_id' => $user1->id,
            'account_expires_at' => now()->subDay(),
        ]);

        BetaRequest::factory()->converted()->create([
            'email' => 'expired2@example.com',
            'user_id' => $user2->id,
            'account_expires_at' => now()->subHour(),
        ]);

        $this->artisan('beta:cleanup-expired')
            ->expectsOutput('📋 Found 2 expired beta user(s).')
            ->assertExitCode(0);

        expect(User::find($user1->id))->toBeNull()
            ->and(User::find($user2->id))->toBeNull();
    });

    it('shows message when no expired users found', function () {
        $this->artisan('beta:cleanup-expired')
            ->expectsOutput('✅ No expired beta users found.')
            ->assertExitCode(0);
    });

    it('only deletes converted beta requests', function () {
        // Create pending beta request (should not be deleted)
        $pendingRequest = BetaRequest::factory()->pending()->create();

        // Create approved but not converted (should not be deleted)
        $approvedRequest = BetaRequest::factory()->approved()->create([
            'account_expires_at' => now()->subDay(),
        ]);

        $this->artisan('beta:cleanup-expired')
            ->expectsOutput('✅ No expired beta users found.')
            ->assertExitCode(0);

        // Both should still exist
        expect(BetaRequest::find($pendingRequest->id))->not->toBeNull()
            ->and(BetaRequest::find($approvedRequest->id))->not->toBeNull();
    });

    it('deletes user data cascades correctly', function () {
        $user = User::factory()->create(['email' => 'cascade@example.com']);
        $betaRequest = BetaRequest::factory()->converted()->create([
            'email' => 'cascade@example.com',
            'user_id' => $user->id,
            'account_expires_at' => now()->subDay(),
        ]);

        // User has a personal workspace created via boot hook
        $workspace = $user->ownedWorkspaces()->where('is_personal', true)->first();
        expect($workspace)->not->toBeNull();

        $this->artisan('beta:cleanup-expired')
            ->assertExitCode(0);

        // User deleted
        expect(User::find($user->id))->toBeNull();

        // Workspace should also be deleted (cascade)
        expect(\App\Models\Workspace::find($workspace->id))->toBeNull();
    });
});

describe('Beta Cleanup All Command', function () {
    it('deletes all converted beta users with force flag', function () {
        $user1 = User::factory()->create(['email' => 'beta1@example.com']);
        $user2 = User::factory()->create(['email' => 'beta2@example.com']);

        BetaRequest::factory()->converted()->create([
            'email' => 'beta1@example.com',
            'user_id' => $user1->id,
            'account_expires_at' => now()->addDays(10), // Not expired
        ]);

        BetaRequest::factory()->converted()->create([
            'email' => 'beta2@example.com',
            'user_id' => $user2->id,
            'account_expires_at' => now()->subDay(), // Expired
        ]);

        $this->artisan('beta:cleanup-all --force')
            ->expectsOutput('📋 Found 2 beta user(s) to delete.')
            ->assertExitCode(0);

        // Both users should be deleted (even the non-expired one)
        expect(User::find($user1->id))->toBeNull()
            ->and(User::find($user2->id))->toBeNull();
    });

    it('requires confirmation without force flag', function () {
        $user = User::factory()->create(['email' => 'confirm@example.com']);
        BetaRequest::factory()->converted()->create([
            'email' => 'confirm@example.com',
            'user_id' => $user->id,
        ]);

        $this->artisan('beta:cleanup-all')
            ->expectsQuestion('Are you sure you want to proceed?', false)
            ->expectsOutput('❌ Operation cancelled.')
            ->assertExitCode(1); // FAILURE

        // User should still exist
        expect(User::find($user->id))->not->toBeNull();
    });

    it('proceeds when user confirms', function () {
        $user = User::factory()->create(['email' => 'confirmed@example.com']);
        BetaRequest::factory()->converted()->create([
            'email' => 'confirmed@example.com',
            'user_id' => $user->id,
        ]);

        $this->artisan('beta:cleanup-all')
            ->expectsQuestion('Are you sure you want to proceed?', true)
            ->assertExitCode(0);

        // User should be deleted
        expect(User::find($user->id))->toBeNull();
    });

    it('shows message when no beta users found', function () {
        $this->artisan('beta:cleanup-all --force')
            ->expectsOutput('✅ No beta users found.')
            ->assertExitCode(0);
    });

    it('marks all beta requests as expired', function () {
        $user1 = User::factory()->create(['email' => 'mark1@example.com']);
        $user2 = User::factory()->create(['email' => 'mark2@example.com']);

        $request1 = BetaRequest::factory()->converted()->create([
            'email' => 'mark1@example.com',
            'user_id' => $user1->id,
        ]);

        $request2 = BetaRequest::factory()->converted()->create([
            'email' => 'mark2@example.com',
            'user_id' => $user2->id,
        ]);

        $this->artisan('beta:cleanup-all --force')
            ->assertExitCode(0);

        $request1->refresh();
        $request2->refresh();

        expect($request1->status)->toBe('expired')
            ->and($request2->status)->toBe('expired');
    });

    it('does not delete non-converted beta requests', function () {
        $pending = BetaRequest::factory()->pending()->create();
        $approved = BetaRequest::factory()->approved()->create();

        $this->artisan('beta:cleanup-all --force')
            ->expectsOutput('✅ No beta users found.')
            ->assertExitCode(0);

        // These should not be touched
        expect(BetaRequest::find($pending->id))->not->toBeNull()
            ->and(BetaRequest::find($approved->id))->not->toBeNull();
    });
});
