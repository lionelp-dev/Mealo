<?php

use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceInvitation;

beforeEach(function () {
    $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);
});

it('converts a shared workspace to personal, removes non-owner members', function () {
    $owner = User::factory()->create();
    $member = User::factory()->create();

    $workspace = Workspace::create([
        'name' => 'Shared Workspace',
        'owner_id' => $owner->id,
        'is_personal' => false,
    ]);

    $workspace->users()->attach($member->id, ['joined_at' => now()]);
    $workspace->giveEditorPermissions($member);

    $this->actingAs($owner)
        ->put(route('workspaces.update', $workspace), [
            'name' => 'Shared Workspace',
            'is_personal' => true,
        ])
        ->assertRedirect();

    $workspace->refresh();

    expect($workspace->is_personal)->toBeTrue();
    expect($workspace->users()->where('user_id', $member->id)->exists())->toBeFalse();
    expect($workspace->users()->where('user_id', $owner->id)->exists())->toBeTrue();
});

it('cancels pending invitations when converting to personal', function () {
    $owner = User::factory()->create();

    $workspace = Workspace::create([
        'name' => 'Shared Workspace',
        'owner_id' => $owner->id,
        'is_personal' => false,
    ]);

    WorkspaceInvitation::create([
        'workspace_id' => $workspace->id,
        'email' => 'invitee@example.com',
        'role' => 'editor',
        'invited_by' => $owner->id,
        'expires_at' => now()->addDays(7),
    ]);

    expect(WorkspaceInvitation::where('workspace_id', $workspace->id)->count())->toBe(1);

    $this->actingAs($owner)
        ->put(route('workspaces.update', $workspace), [
            'name' => 'Shared Workspace',
            'is_personal' => true,
        ])
        ->assertRedirect();

    expect(WorkspaceInvitation::where('workspace_id', $workspace->id)->count())->toBe(0);
});

it('keeps the owner as member when converting to personal', function () {
    $owner = User::factory()->create();

    $workspace = Workspace::create([
        'name' => 'Shared Workspace',
        'owner_id' => $owner->id,
        'is_personal' => false,
    ]);

    $this->actingAs($owner)
        ->put(route('workspaces.update', $workspace), [
            'name' => 'Shared Workspace',
            'is_personal' => true,
        ])
        ->assertRedirect();

    expect($workspace->users()->where('user_id', $owner->id)->exists())->toBeTrue();
});

it('does not remove members when only updating the name', function () {
    $owner = User::factory()->create();
    $member = User::factory()->create();

    $workspace = Workspace::create([
        'name' => 'Shared Workspace',
        'owner_id' => $owner->id,
        'is_personal' => false,
    ]);

    $workspace->users()->attach($member->id, ['joined_at' => now()]);
    $workspace->giveEditorPermissions($member);

    $this->actingAs($owner)
        ->put(route('workspaces.update', $workspace), [
            'name' => 'Renamed Workspace',
        ])
        ->assertRedirect();

    expect($workspace->users()->where('user_id', $member->id)->exists())->toBeTrue();
});

it('does not trigger cleanup when workspace is already personal', function () {
    $owner = User::factory()->create();

    $workspace = Workspace::create([
        'name' => 'Personal Workspace',
        'owner_id' => $owner->id,
        'is_personal' => true,
    ]);

    $this->actingAs($owner)
        ->put(route('workspaces.update', $workspace), [
            'name' => 'Personal Workspace',
            'is_personal' => true,
        ])
        ->assertRedirect();

    expect($workspace->users()->where('user_id', $owner->id)->exists())->toBeTrue();
});

it('forbids non-owner from converting workspace type', function () {
    $owner = User::factory()->create();
    $editor = User::factory()->create();

    $workspace = Workspace::create([
        'name' => 'Shared Workspace',
        'owner_id' => $owner->id,
        'is_personal' => false,
    ]);

    $workspace->users()->attach($editor->id, ['joined_at' => now()]);
    $workspace->giveEditorPermissions($editor);

    $this->actingAs($editor)
        ->put(route('workspaces.update', $workspace), [
            'name' => 'Shared Workspace',
            'is_personal' => true,
        ])
        ->assertForbidden();
});

it('forbids changing is_personal on default workspace', function () {
    $owner = User::factory()->create();

    $workspace = Workspace::create([
        'name' => 'Default Workspace',
        'owner_id' => $owner->id,
        'is_personal' => true,
        'is_default' => true,
    ]);

    $this->actingAs($owner)
        ->put(route('workspaces.update', $workspace), [
            'name' => 'Default Workspace',
            'is_personal' => false,
        ])
        ->assertSessionHasErrors('is_personal');

    $workspace->refresh();
    expect($workspace->is_personal)->toBeTrue();
});

it('allows updating name on default workspace', function () {
    $owner = User::factory()->create();

    $workspace = Workspace::create([
        'name' => 'Default Workspace',
        'owner_id' => $owner->id,
        'is_personal' => true,
        'is_default' => true,
    ]);

    $this->actingAs($owner)
        ->put(route('workspaces.update', $workspace), [
            'name' => 'Renamed Default Workspace',
        ])
        ->assertRedirect();

    $workspace->refresh();
    expect($workspace->name)->toBe('Renamed Default Workspace');
});
