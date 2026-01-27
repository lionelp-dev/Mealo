<?php

namespace Tests\Feature\Workspace;

use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceInvitation;

beforeEach(function () {
    // Seed roles and permissions first
    $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);
    
    $this->owner = User::factory()->create();
    $this->invitee = User::factory()->create(['email' => 'invitee@example.com']);
    $this->otherUser = User::factory()->create();
    
    $this->workspace = Workspace::create([
        'name' => 'Test Workspace',
        'owner_id' => $this->owner->id,
        'is_personal' => false,
    ]);
});

test('workspace owner can send invitation', function () {
    $invitationData = [
        'email' => 'newuser@example.com',
        'role' => 'editor',
    ];

    $response = $this->actingAs($this->owner)
        ->post(route('workspace-invitations.store', $this->workspace), $invitationData);

    $response->assertStatus(302);
    $response->assertSessionHas('success', 'Invitation sent successfully');

    $this->assertDatabaseHas('workspace_invitations', [
        'workspace_id' => $this->workspace->id,
        'email' => 'newuser@example.com',
        'role' => 'editor',
        'invited_by' => $this->owner->id,
    ]);
});

test('non-owner cannot send invitation', function () {
    // Add user as editor (not owner)
    $this->workspace->users()->attach($this->otherUser->id, [
        'joined_at' => now(),
    ]);
    $this->workspace->giveEditorPermissions($this->otherUser);

    $invitationData = [
        'email' => 'newuser@example.com',
        'role' => 'editor',
    ];

    $response = $this->actingAs($this->otherUser)
        ->post(route('workspace-invitations.store', $this->workspace), $invitationData);

    $response->assertStatus(403);
});

test('cannot send invitation with invalid data', function () {
    // Missing email
    $response = $this->actingAs($this->owner)
        ->post(route('workspace-invitations.store', $this->workspace), [
            'role' => 'editor',
        ]);
    $response->assertStatus(302);
    $response->assertSessionHasErrors(['email']);

    // Invalid email
    $response = $this->actingAs($this->owner)
        ->post(route('workspace-invitations.store', $this->workspace), [
            'email' => 'invalid-email',
            'role' => 'editor',
        ]);
    $response->assertStatus(302);
    $response->assertSessionHasErrors(['email']);

    // Invalid role
    $response = $this->actingAs($this->owner)
        ->post(route('workspace-invitations.store', $this->workspace), [
            'email' => 'test@example.com',
            'role' => 'invalid-role',
        ]);
    $response->assertStatus(302);
    $response->assertSessionHasErrors(['role']);

    // Cannot invite owner role
    $response = $this->actingAs($this->owner)
        ->post(route('workspace-invitations.store', $this->workspace), [
            'email' => 'test@example.com',
            'role' => 'owner',
        ]);
    $response->assertStatus(302);
    $response->assertSessionHasErrors(['role']);
});

test('cannot send duplicate invitation', function () {
    // Send first invitation
    $this->actingAs($this->owner)
        ->post(route('workspace-invitations.store', $this->workspace), [
            'email' => 'test@example.com',
            'role' => 'editor',
        ]);

    // Try to send duplicate
    $response = $this->actingAs($this->owner)
        ->post(route('workspace-invitations.store', $this->workspace), [
            'email' => 'test@example.com',
            'role' => 'viewer',
        ]);

    $response->assertStatus(302);
    $response->assertSessionHasErrors(['email']);
});

test('cannot invite existing member', function () {
    // Add user to workspace
    $this->workspace->users()->attach($this->invitee->id, [
        'joined_at' => now(),
    ]);
    $this->workspace->giveEditorPermissions($this->invitee);

    $response = $this->actingAs($this->owner)
        ->post(route('workspace-invitations.store', $this->workspace), [
            'email' => $this->invitee->email,
            'role' => 'editor',
        ]);

    $response->assertStatus(409);
    $response->assertJson(['message' => 'User is already a member of this workspace']);
});

test('invited user can accept invitation', function () {
    $invitation = WorkspaceInvitation::create([
        'workspace_id' => $this->workspace->id,
        'email' => $this->invitee->email,
        'role' => 'editor',
        'invited_by' => $this->owner->id,
    ]);

    $response = $this->actingAs($this->invitee)
        ->post(route('workspace-invitations.accept', $invitation->token));

    $response->assertStatus(200);
    $response->assertJson(['message' => 'Invitation accepted successfully']);

    // User should be added to workspace
    expect($this->workspace->fresh()->hasUser($this->invitee))->toBeTrue();
    expect($this->workspace->fresh()->getUserRole($this->invitee))->toBe('editor');

    // Invitation should be deleted
    expect(WorkspaceInvitation::find($invitation->id))->toBeNull();
});

test('cannot accept expired invitation', function () {
    $invitation = WorkspaceInvitation::create([
        'workspace_id' => $this->workspace->id,
        'email' => $this->invitee->email,
        'role' => 'editor',
        'invited_by' => $this->owner->id,
        'expires_at' => now()->subHour(),
    ]);

    $response = $this->actingAs($this->invitee)
        ->post(route('workspace-invitations.accept', $invitation->token));

    $response->assertStatus(410);
    $response->assertJson(['message' => 'Invitation expired or invalid']);

    expect($this->workspace->fresh()->hasUser($this->invitee))->toBeFalse();
});

test('cannot accept invitation for different email', function () {
    $invitation = WorkspaceInvitation::create([
        'workspace_id' => $this->workspace->id,
        'email' => 'different@example.com',
        'role' => 'editor',
        'invited_by' => $this->owner->id,
    ]);

    $response = $this->actingAs($this->invitee)
        ->post(route('workspace-invitations.accept', $invitation->token));

    $response->assertStatus(302);
    $response->assertSessionHas('message', 'Failed to accept invitation');

    expect($this->workspace->fresh()->hasUser($this->invitee))->toBeFalse();
});

test('cannot accept non-existent invitation', function () {
    $response = $this->actingAs($this->invitee)
        ->post(route('workspace-invitations.accept', 'invalid-token'));

    $response->assertStatus(404);
});

test('invited user can decline invitation', function () {
    $invitation = WorkspaceInvitation::create([
        'workspace_id' => $this->workspace->id,
        'email' => $this->invitee->email,
        'role' => 'editor',
        'invited_by' => $this->owner->id,
    ]);

    $response = $this->actingAs($this->invitee)
        ->post(route('workspace-invitations.decline', $invitation->token));

    $response->assertStatus(302);
    $response->assertSessionHas('message', 'Invitation declined');

    // User should not be added to workspace
    expect($this->workspace->fresh()->hasUser($this->invitee))->toBeFalse();

    // Invitation should be deleted
    expect(WorkspaceInvitation::find($invitation->id))->toBeNull();
});

test('cannot decline invitation for different email', function () {
    $invitation = WorkspaceInvitation::create([
        'workspace_id' => $this->workspace->id,
        'email' => 'different@example.com',
        'role' => 'editor',
        'invited_by' => $this->owner->id,
    ]);

    $response = $this->actingAs($this->invitee)
        ->post(route('workspace-invitations.decline', $invitation->token));

    $response->assertStatus(403);
    $response->assertJson(['message' => 'Unauthorized']);

    // Invitation should still exist
    expect(WorkspaceInvitation::find($invitation->id))->not->toBeNull();
});

test('workspace owner can cancel invitation', function () {
    $invitation = WorkspaceInvitation::create([
        'workspace_id' => $this->workspace->id,
        'email' => 'test@example.com',
        'role' => 'editor',
        'invited_by' => $this->owner->id,
    ]);

    $response = $this->actingAs($this->owner)
        ->delete(route('workspace-invitations.destroy', $invitation));

    $response->assertStatus(302);
    $response->assertSessionHas('message', 'Invitation cancelled');

    expect(WorkspaceInvitation::find($invitation->id))->toBeNull();
});

test('non-owner cannot cancel invitation', function () {
    $invitation = WorkspaceInvitation::create([
        'workspace_id' => $this->workspace->id,
        'email' => 'test@example.com',
        'role' => 'editor',
        'invited_by' => $this->owner->id,
    ]);

    // Add user as editor
    $this->workspace->users()->attach($this->otherUser->id, [
        'joined_at' => now(),
    ]);
    $this->workspace->giveEditorPermissions($this->otherUser);

    $response = $this->actingAs($this->otherUser)
        ->delete(route('workspace-invitations.destroy', $invitation));

    $response->assertStatus(403);

    expect(WorkspaceInvitation::find($invitation->id))->not->toBeNull();
});

test('can send invitation after previous one expired', function () {
    // Create expired invitation
    WorkspaceInvitation::create([
        'workspace_id' => $this->workspace->id,
        'email' => 'test@example.com',
        'role' => 'editor',
        'invited_by' => $this->owner->id,
        'expires_at' => now()->subHour(),
    ]);

    // Send new invitation with same email
    $response = $this->actingAs($this->owner)
        ->post(route('workspace-invitations.store', $this->workspace), [
            'email' => 'test@example.com',
            'role' => 'viewer',
        ]);

    $response->assertStatus(302);
    $response->assertSessionHas('success', 'Invitation sent successfully');

    // Should have 2 invitations total (expired one + new one)
    $invitations = WorkspaceInvitation::where('email', 'test@example.com')->get();
    expect($invitations)->toHaveCount(2);
});