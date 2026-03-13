<?php

use App\Models\BetaRequest;
use App\Models\User;
use App\Models\Workspace;

describe('Beta Invitation Acceptance', function () {
    describe('Show Password Setup Page', function () {
        it('shows password setup page for valid token', function () {
            $betaRequest = BetaRequest::factory()->approved()->create();

            $response = $this->get("/beta/accept/{$betaRequest->token}");

            $response->assertSuccessful()
                ->assertInertia(fn ($page) => $page
                    ->component('auth/beta-set-password')
                    ->has('token')
                    ->where('email', $betaRequest->email)
                );
        });

        it('redirects for invalid token', function () {
            $response = $this->get('/beta/accept/invalid-token');

            $response->assertRedirect(route('home'))
                ->assertSessionHas('error', 'Lien d\'invitation invalide ou expiré.');
        });

        it('redirects for expired token', function () {
            $betaRequest = BetaRequest::factory()->approved()->create([
                'token_expires_at' => now()->subDay(),
            ]);

            $response = $this->get("/beta/accept/{$betaRequest->token}");

            $response->assertRedirect(route('home'))
                ->assertSessionHas('error');
        });

        it('redirects for already used token', function () {
            $user = User::factory()->create();
            $betaRequest = BetaRequest::factory()->approved()->create([
                'user_id' => $user->id,
            ]);

            $response = $this->get("/beta/accept/{$betaRequest->token}");

            $response->assertRedirect(route('home'))
                ->assertSessionHas('error');
        });

        it('redirects for pending beta request', function () {
            $betaRequest = BetaRequest::factory()->create([
                'status' => 'pending',
                'token' => 'some-token',
                'token_expires_at' => now()->addDays(7),
            ]);

            $response = $this->get("/beta/accept/{$betaRequest->token}");

            $response->assertRedirect(route('home'))
                ->assertSessionHas('error');
        });
    });

    describe('Accept Invitation', function () {
        it('requires name', function () {
            $betaRequest = BetaRequest::factory()->approved()->create();

            $response = $this->postJson("/beta/accept/{$betaRequest->token}", [
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ]);

            $response->assertUnprocessable()
                ->assertJsonValidationErrors(['name' => 'Le nom est requis.']);
        });

        it('requires password', function () {
            $betaRequest = BetaRequest::factory()->approved()->create();

            $response = $this->postJson("/beta/accept/{$betaRequest->token}", [
                'name' => 'Test User',
            ]);

            $response->assertUnprocessable()
                ->assertJsonValidationErrors(['password' => 'Le mot de passe est requis.']);
        });

        it('requires password with minimum 8 characters', function () {
            $betaRequest = BetaRequest::factory()->approved()->create();

            $response = $this->postJson("/beta/accept/{$betaRequest->token}", [
                'name' => 'Test User',
                'password' => 'short',
                'password_confirmation' => 'short',
            ]);

            $response->assertUnprocessable()
                ->assertJsonValidationErrors(['password' => 'Le mot de passe doit contenir au moins 8 caractères.']);
        });

        it('requires password confirmation to match', function () {
            $betaRequest = BetaRequest::factory()->approved()->create();

            $response = $this->postJson("/beta/accept/{$betaRequest->token}", [
                'name' => 'Test User',
                'password' => 'password123',
                'password_confirmation' => 'different',
            ]);

            $response->assertUnprocessable()
                ->assertJsonValidationErrors(['password' => 'Les mots de passe ne correspondent pas.']);
        });

        it('creates user with verified email', function () {
            $betaRequest = BetaRequest::factory()->approved()->create([
                'email' => 'beta@example.com',
            ]);

            $this->post("/beta/accept/{$betaRequest->token}", [
                'name' => 'Test User',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ]);

            $user = User::where('email', 'beta@example.com')->first();

            expect($user)->not->toBeNull()
                ->and($user->name)->toBe('Test User');

            $this->assertNotNull($user->email_verified_at, 'Email should be verified');
        });

        it('creates personal workspace via User hook', function () {
            $betaRequest = BetaRequest::factory()->approved()->create();

            $this->post("/beta/accept/{$betaRequest->token}", [
                'name' => 'Test User',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ]);

            $user = User::where('email', $betaRequest->email)->first();
            $workspace = Workspace::where('owner_id', $user->id)
                ->where('is_personal', true)
                ->first();

            expect($workspace)->not->toBeNull()
                ->and($workspace->name)->toBe('Mon espace')
                ->and($workspace->is_default)->toBeTrue();
        });

        it('marks beta request as converted', function () {
            $betaRequest = BetaRequest::factory()->approved()->create();

            $this->post("/beta/accept/{$betaRequest->token}", [
                'name' => 'Test User',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ]);

            $betaRequest->refresh();

            expect($betaRequest->status)->toBe('converted')
                ->and($betaRequest->user_id)->not->toBeNull();
        });

        it('sets account expiration date on beta request', function () {
            config(['beta.expiration_days' => 30]);
            $betaRequest = BetaRequest::factory()->approved()->create();

            $this->post("/beta/accept/{$betaRequest->token}", [
                'name' => 'Test User',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ]);

            $betaRequest->refresh();

            expect($betaRequest->account_expires_at)->not->toBeNull();

            $daysDiff = now()->diffInDays($betaRequest->account_expires_at, false);
            expect((int) round($daysDiff))->toBe(30);
        });

        it('authenticates user automatically', function () {
            $betaRequest = BetaRequest::factory()->approved()->create();

            $response = $this->post("/beta/accept/{$betaRequest->token}", [
                'name' => 'Test User',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ]);

            $user = User::where('email', $betaRequest->email)->first();

            $this->assertAuthenticatedAs($user);
        });

        it('redirects to dashboard after success', function () {
            $betaRequest = BetaRequest::factory()->approved()->create();

            $response = $this->post("/beta/accept/{$betaRequest->token}", [
                'name' => 'Test User',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ]);

            $response->assertRedirect(route('dashboard'))
                ->assertSessionHas('success', 'Bienvenue ! Votre compte beta a été activé avec succès.');
        });

        it('rejects invalid token', function () {
            $response = $this->post('/beta/accept/invalid-token', [
                'name' => 'Test User',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ]);

            $response->assertRedirect(route('home'))
                ->assertSessionHas('error');
        });

        it('rejects expired token', function () {
            $betaRequest = BetaRequest::factory()->approved()->create([
                'token_expires_at' => now()->subDay(),
            ]);

            $response = $this->post("/beta/accept/{$betaRequest->token}", [
                'name' => 'Test User',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ]);

            $response->assertRedirect(route('home'))
                ->assertSessionHas('error');

            // Ensure user was not created
            expect(User::where('email', $betaRequest->email)->exists())->toBeFalse();
        });

        it('rejects already used token', function () {
            $email = 'used@example.com';
            $user = User::factory()->create(['email' => $email]);
            $betaRequest = BetaRequest::factory()->approved()->create([
                'email' => $email,
                'user_id' => $user->id,
            ]);

            $response = $this->post("/beta/accept/{$betaRequest->token}", [
                'name' => 'Test User',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ]);

            $response->assertRedirect(route('home'))
                ->assertSessionHas('error');

            // Ensure no new user was created (still only 1 user with this email)
            expect(User::where('email', $email)->count())->toBe(1);
        });
    });

    describe('Beta User Properties', function () {
        it('user has is_beta_user accessor returning true', function () {
            $betaRequest = BetaRequest::factory()->approved()->create();

            $this->post("/beta/accept/{$betaRequest->token}", [
                'name' => 'Test User',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ]);

            $user = User::where('email', $betaRequest->email)->first();

            expect($user->is_beta_user)->toBeTrue();
        });

        it('non-beta user has is_beta_user accessor returning false', function () {
            $user = User::factory()->create();

            expect($user->is_beta_user)->toBeFalse();
        });
    });
});
