<?php

namespace Tests\Unit;

use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceInvitation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;


beforeEach(function () {
    $this->user = User::factory()->create();
    $this->invitee = User::factory()->create();
    $this->invitee->update(['email' => 'invitee@example.com']);

    $this->workspace = Workspace::create([
        'name' => 'Test Workspace',
        'owner_id' => $this->user->id,
        'is_personal' => false,
    ]);
});

test('workspace invitation can be created with valid data', function () {
    $invitation = WorkspaceInvitation::create([
        'workspace_id' => $this->workspace->id,
        'email' => 'test@example.com',
        'role' => 'editor',
        'invited_by' => $this->user->id,
    ]);

    expect($invitation)->toBeInstanceOf(WorkspaceInvitation::class);
    expect($invitation->email)->toBe('test@example.com');
    expect($invitation->role)->toBe('editor');
    expect($invitation->invited_by)->toBe($this->user->id);
});

test('workspace invitation automatically generates token on creation', function () {
    $invitation = WorkspaceInvitation::create([
        'workspace_id' => $this->workspace->id,
        'email' => 'test@example.com',
        'role' => 'editor',
        'invited_by' => $this->user->id,
    ]);

    expect($invitation->token)->not->toBeNull();
    expect(strlen($invitation->token))->toBe(32);
});

test('workspace invitation automatically sets expiration date on creation', function () {
    $invitation = WorkspaceInvitation::create([
        'workspace_id' => $this->workspace->id,
        'email' => 'test@example.com',
        'role' => 'editor',
        'invited_by' => $this->user->id,
    ]);

    expect($invitation->expires_at)->not->toBeNull();
    expect($invitation->expires_at->isFuture())->toBeTrue();
    expect(now()->diffInDays($invitation->expires_at, false))->toBeGreaterThanOrEqual(6);
});

test('workspace invitation has correct relationships', function () {
    $invitation = WorkspaceInvitation::create([
        'workspace_id' => $this->workspace->id,
        'email' => 'test@example.com',
        'role' => 'editor',
        'invited_by' => $this->user->id,
    ]);

    // Workspace relationship
    expect($invitation->workspace)->toBeInstanceOf(Workspace::class);
    expect($invitation->workspace->id)->toBe($this->workspace->id);

    // InvitedBy relationship
    expect($invitation->invitedBy)->toBeInstanceOf(User::class);
    expect($invitation->invitedBy->id)->toBe($this->user->id);
});

test('can check if invitation is expired', function () {
    // Create valid invitation
    $validInvitation = WorkspaceInvitation::create([
        'workspace_id' => $this->workspace->id,
        'email' => 'test@example.com',
        'role' => 'editor',
        'invited_by' => $this->user->id,
    ]);

    expect($validInvitation->isExpired())->toBeFalse();
    expect($validInvitation->isValid())->toBeTrue();

    // Create expired invitation
    $expiredInvitation = WorkspaceInvitation::create([
        'workspace_id' => $this->workspace->id,
        'email' => 'expired@example.com',
        'role' => 'editor',
        'invited_by' => $this->user->id,
        'expires_at' => now()->subHour(),
    ]);

    expect($expiredInvitation->isExpired())->toBeTrue();
    expect($expiredInvitation->isValid())->toBeFalse();
});

test('can accept valid invitation', function () {
    $invitation = WorkspaceInvitation::create([
        'workspace_id' => $this->workspace->id,
        'email' => $this->invitee->email,
        'role' => 'editor',
        'invited_by' => $this->user->id,
    ]);

    // Accept invitation
    $result = $invitation->accept($this->invitee);

    expect($result)->toBeTrue();

    // User should be added to workspace
    expect($this->workspace->hasUser($this->invitee))->toBeTrue();
    // Check that user has editor role and permissions
    expect($this->invitee->hasRole('editor'))->toBeTrue();
    expect($this->invitee->hasPermissionTo('planning.edit'))->toBeTrue();

    // Invitation should be deleted
    expect(WorkspaceInvitation::find($invitation->id))->toBeNull();
});

test('cannot accept expired invitation', function () {
    $invitation = WorkspaceInvitation::create([
        'workspace_id' => $this->workspace->id,
        'email' => $this->invitee->email,
        'role' => 'editor',
        'invited_by' => $this->user->id,
        'expires_at' => now()->subHour(),
    ]);

    $result = $invitation->accept($this->invitee);

    expect($result)->toBeFalse();
    expect($this->workspace->hasUser($this->invitee))->toBeFalse();
});

test('cannot accept invitation with wrong email', function () {
    $invitation = WorkspaceInvitation::create([
        'workspace_id' => $this->workspace->id,
        'email' => 'different@example.com',
        'role' => 'editor',
        'invited_by' => $this->user->id,
    ]);

    $result = $invitation->accept($this->invitee);

    expect($result)->toBeFalse();
    expect($this->workspace->hasUser($this->invitee))->toBeFalse();
});

