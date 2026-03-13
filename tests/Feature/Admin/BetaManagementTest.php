<?php

namespace Tests\Feature\Admin;

use App\Mail\BetaInvitationMail;
use App\Models\BetaRequest;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

describe('Admin Beta Management', function () {
    beforeEach(function () {
        Mail::fake();

        // Set team context to null for global permissions
        setPermissionsTeamId(null);

        // Create admin role and permission (GLOBAL - no workspace)
        Permission::create(['name' => 'access-admin-panel']);
        $this->adminRole = Role::create(['name' => 'admin']);
        $this->adminRole->givePermissionTo('access-admin-panel');

        // Create admin user
        $this->admin = User::factory()->create();

        // IMPORTANT: Set team ID to null before assigning global role
        // (User creation sets workspace context)
        setPermissionsTeamId(null);
        $this->admin->assignRole('admin');
        $this->admin->refresh(); // Refresh to load roles/permissions

        // Create regular user (non-admin)
        $this->user = User::factory()->create();
    });

    describe('Authentication & Authorization', function () {
        it('requires authentication to access beta requests index', function () {
            $response = $this->get('/admin/beta-requests');

            $response->assertRedirect('/login');
        });

        it('requires access-admin-panel permission to access beta requests index', function () {
            $response = $this->actingAs($this->user)->get('/admin/beta-requests');

            $response->assertForbidden();
        });

        it('allows admin with access-admin-panel permission to access index', function () {
            // Ensure global permission context for this request
            setPermissionsTeamId(null);

            $response = $this->actingAs($this->admin)->get('/admin/beta-requests');

            $response->assertSuccessful();
        });
    });

    describe('Index & Filtering', function () {
        beforeEach(function () {
            BetaRequest::factory()->pending()->create(['email' => 'pending@example.com']);
            BetaRequest::factory()->approved()->create(['email' => 'approved@example.com']);
            BetaRequest::factory()->rejected()->create(['email' => 'rejected@example.com']);
            BetaRequest::factory()->converted()->create(['email' => 'converted@example.com']);
        });

        it('displays all beta requests', function () {
            setPermissionsTeamId(null);

            $response = $this->actingAs($this->admin)->get('/admin/beta-requests');

            $response->assertSuccessful()
                ->assertInertia(
                    fn ($page) => $page
                        ->component('admin/beta-requests')
                        ->has('betaRequests.data', 4)
                );
        });

        it('filters beta requests by status', function () {
            setPermissionsTeamId(null);

            $response = $this->actingAs($this->admin)
                ->get('/admin/beta-requests?status=pending');

            $response->assertSuccessful()
                ->assertInertia(
                    fn ($page) => $page
                        ->has('betaRequests.data', 1)
                        ->where('betaRequests.data.0.email', 'pending@example.com')
                );
        });

        it('searches beta requests by email', function () {
            setPermissionsTeamId(null);

            $response = $this->actingAs($this->admin)
                ->get('/admin/beta-requests?search=approved');

            $response->assertSuccessful()
                ->assertInertia(
                    fn ($page) => $page
                        ->has('betaRequests.data', 1)
                        ->where('betaRequests.data.0.email', 'approved@example.com')
                );
        });

        it('provides statistics', function () {
            setPermissionsTeamId(null);

            $response = $this->actingAs($this->admin)->get('/admin/beta-requests');

            $response->assertSuccessful()
                ->assertInertia(
                    fn ($page) => $page
                        ->has('stats')
                        ->where('stats.pending', 1)
                        ->where('stats.approved', 1)
                        ->where('stats.rejected', 1)
                        ->where('stats.converted', 1)
                        ->where('stats.total', 4)
                );
        });
    });

    describe('Approve Beta Request', function () {
        it('requires authentication', function () {
            $betaRequest = BetaRequest::factory()->pending()->create();

            $response = $this->post("/admin/beta-requests/{$betaRequest->id}/approve");

            $response->assertRedirect('/login');
        });

        it('requires access-admin-panel permission', function () {
            $betaRequest = BetaRequest::factory()->pending()->create();

            $response = $this->actingAs($this->user)
                ->post("/admin/beta-requests/{$betaRequest->id}/approve");

            $response->assertForbidden();
        });

        it('approves pending beta request', function () {
            setPermissionsTeamId(null);
            $betaRequest = BetaRequest::factory()->pending()->create();

            $response = $this->actingAs($this->admin)
                ->post("/admin/beta-requests/{$betaRequest->id}/approve");

            $response->assertRedirect();
            $betaRequest->refresh();

            expect($betaRequest->status)->toBe('approved')
                ->and($betaRequest->token)->not->toBeNull()
                ->and($betaRequest->token_expires_at)->not->toBeNull()
                ->and($betaRequest->approved_by)->toBe($this->admin->id)
                ->and($betaRequest->approved_at)->not->toBeNull();
        });

        it('sends invitation email after approval', function () {
            setPermissionsTeamId(null);
            $betaRequest = BetaRequest::factory()->pending()->create();

            $response = $this->actingAs($this->admin)
                ->post("/admin/beta-requests/{$betaRequest->id}/approve");

            Mail::assertQueued(BetaInvitationMail::class, function ($mail) use ($betaRequest) {
                return $mail->hasTo($betaRequest->email)
                    && $mail->betaRequest->id === $betaRequest->id;
            });
        });

        it('cannot approve non-pending beta request', function () {
            $betaRequest = BetaRequest::factory()->approved()->create();

            $response = $this->actingAs($this->admin)
                ->post("/admin/beta-requests/{$betaRequest->id}/approve");

            $response->assertForbidden();
        });
    });

    describe('Reject Beta Request', function () {
        it('requires authentication', function () {
            $betaRequest = BetaRequest::factory()->pending()->create();

            $response = $this->post("/admin/beta-requests/{$betaRequest->id}/reject");

            $response->assertRedirect('/login');
        });

        it('requires access-admin-panel permission', function () {
            $betaRequest = BetaRequest::factory()->pending()->create();

            $response = $this->actingAs($this->user)
                ->post("/admin/beta-requests/{$betaRequest->id}/reject");

            $response->assertForbidden();
        });

        it('rejects pending beta request', function () {
            setPermissionsTeamId(null);
            $betaRequest = BetaRequest::factory()->pending()->create();

            $response = $this->actingAs($this->admin)
                ->post("/admin/beta-requests/{$betaRequest->id}/reject", [
                    'rejection_reason' => 'Invalid request',
                ]);

            $response->assertRedirect();
            $betaRequest->refresh();

            expect($betaRequest->status)->toBe('rejected')
                ->and($betaRequest->rejection_reason)->toBe('Invalid request');
        });

        it('cannot reject non-pending beta request', function () {
            $betaRequest = BetaRequest::factory()->approved()->create();

            $response = $this->actingAs($this->admin)
                ->post("/admin/beta-requests/{$betaRequest->id}/reject");

            $response->assertForbidden();
        });
    });

    describe('Resend Invitation', function () {
        it('requires authentication', function () {
            $betaRequest = BetaRequest::factory()->approved()->create();

            $response = $this->post("/admin/beta-requests/{$betaRequest->id}/resend");

            $response->assertRedirect('/login');
        });

        it('requires access-admin-panel permission', function () {
            $betaRequest = BetaRequest::factory()->approved()->create();

            $response = $this->actingAs($this->user)
                ->post("/admin/beta-requests/{$betaRequest->id}/resend");

            $response->assertForbidden();
        });

        it('resends invitation for approved request with valid token', function () {
            setPermissionsTeamId(null);
            $betaRequest = BetaRequest::factory()->approved()->create();

            $response = $this->actingAs($this->admin)
                ->post("/admin/beta-requests/{$betaRequest->id}/resend");

            $response->assertRedirect();

            Mail::assertQueued(BetaInvitationMail::class);
        });

        it('cannot resend invitation for expired token', function () {
            setPermissionsTeamId(null);
            $betaRequest = BetaRequest::factory()->approved()->create([
                'token_expires_at' => now()->subDay(),
            ]);

            $response = $this->actingAs($this->admin)
                ->post("/admin/beta-requests/{$betaRequest->id}/resend");

            $response->assertRedirect()
                ->assertSessionHas('error');

            Mail::assertNothingQueued();
        });
    });

    describe('Cleanup All Beta Users', function () {
        it('requires authentication', function () {
            $response = $this->post('/admin/beta-requests/cleanup-all');

            $response->assertRedirect('/login');
        });

        it('requires access-admin-panel permission', function () {
            $response = $this->actingAs($this->user)
                ->post('/admin/beta-requests/cleanup-all');

            $response->assertForbidden();
        });

        it('deletes all converted beta users and their data', function () {
            setPermissionsTeamId(null);
            $user1 = User::factory()->create();
            $user2 = User::factory()->create();

            $betaRequest1 = BetaRequest::factory()->converted()->create(['user_id' => $user1->id]);
            $betaRequest2 = BetaRequest::factory()->converted()->create(['user_id' => $user2->id]);
            $betaRequest3 = BetaRequest::factory()->pending()->create(); // Should not be deleted

            $response = $this->actingAs($this->admin)
                ->post('/admin/beta-requests/cleanup-all');

            $response->assertRedirect()
                ->assertSessionHas('success');

            // Check users were deleted
            expect(User::find($user1->id))->toBeNull()
                ->and(User::find($user2->id))->toBeNull();

            // Check beta requests marked as expired
            $betaRequest1->refresh();
            $betaRequest2->refresh();
            $betaRequest3->refresh();

            expect($betaRequest1->status)->toBe('expired')
                ->and($betaRequest2->status)->toBe('expired')
                ->and($betaRequest3->status)->toBe('pending'); // Should remain unchanged
        });

        it('returns count of deleted users', function () {
            setPermissionsTeamId(null);
            $user1 = User::factory()->create();
            $user2 = User::factory()->create();

            BetaRequest::factory()->converted()->create(['user_id' => $user1->id]);
            BetaRequest::factory()->converted()->create(['user_id' => $user2->id]);

            $response = $this->actingAs($this->admin)
                ->post('/admin/beta-requests/cleanup-all');

            $response->assertSessionHas('success', '2 comptes beta supprimés avec succès.');
        });
    });
});
