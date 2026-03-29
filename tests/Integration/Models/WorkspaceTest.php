<?php

namespace Tests\Integration\Models;

use App\Models\User;
use App\Models\Workspace;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->otherUser = User::factory()->create();
});

test('workspace can be created with valid data', function () {
    $workspace = Workspace::create([
        'name' => 'Test Workspace',
        'description' => 'A test workspace',
        'owner_id' => $this->user->id,
        'is_personal' => false,
    ]);

    expect($workspace)->toBeInstanceOf(Workspace::class);
    expect($workspace->name)->toBe('Test Workspace');
    expect($workspace->owner_id)->toBe($this->user->id);
    expect($workspace->is_personal)->toBeFalse();
});

test('workspace automatically adds owner as member on creation', function () {
    $workspace = Workspace::create([
        'name' => 'Test Workspace',
        'owner_id' => $this->user->id,
        'is_personal' => false,
    ]);

    expect($workspace->users)->toHaveCount(1);
    expect($workspace->users->first()->id)->toBe($this->user->id);
    // Check that user has owner role and permissions
    expect($this->user->hasRole('owner'))->toBeTrue();
    expect($this->user->hasPermissionTo('workspace.manage'))->toBeTrue();
});

test('workspace has correct relationships', function () {
    $workspace = Workspace::create([
        'name' => 'Test Workspace',
        'owner_id' => $this->user->id,
        'is_personal' => false,
    ]);

    // Owner relationship
    expect($workspace->owner)->toBeInstanceOf(User::class);
    expect($workspace->owner->id)->toBe($this->user->id);

    // Users relationship
    expect($workspace->users)->toBeInstanceOf(\Illuminate\Database\Eloquent\Collection::class);

    // Invitations relationship
    expect($workspace->invitations)->toBeInstanceOf(\Illuminate\Database\Eloquent\Collection::class);
});

test('workspace can check if user has access', function () {
    $workspace = Workspace::create([
        'name' => 'Test Workspace',
        'owner_id' => $this->user->id,
        'is_personal' => false,
    ]);

    // Owner should have access
    expect($workspace->hasUser($this->user))->toBeTrue();

    // Other user should not have access
    expect($workspace->hasUser($this->otherUser))->toBeFalse();

    // Add other user with editor role using Spatie
    $workspace->users()->attach($this->otherUser->id, [
        'joined_at' => now(),
    ]);
    $workspace->giveEditorPermissions($this->otherUser);

    expect($workspace->hasUser($this->otherUser))->toBeTrue();
});

test('workspace permissions work with Spatie', function () {
    $workspace = Workspace::create([
        'name' => 'Test Workspace',
        'owner_id' => $this->user->id,
        'is_personal' => false,
    ]);

    // Owner should have owner role and permissions
    expect($this->user->hasRole('owner'))->toBeTrue();
    expect($this->user->hasPermissionTo('workspace.manage'))->toBeTrue();
    expect($this->user->hasPermissionTo('planning.edit'))->toBeTrue();

    // Clean other user roles from previous tests
    $this->otherUser->syncRoles([]);

    // User without access should not have roles
    expect($this->otherUser->hasRole('owner'))->toBeFalse();
    expect($this->otherUser->hasRole('viewer'))->toBeFalse();

    // Add user with viewer permissions
    $workspace->users()->attach($this->otherUser->id, [
        'joined_at' => now(),
    ]);
    $workspace->giveViewerPermissions($this->otherUser);

    expect($this->otherUser->hasRole('viewer'))->toBeTrue();
    expect($this->otherUser->hasPermissionTo('workspace.view'))->toBeTrue();
    expect($this->otherUser->hasPermissionTo('planning.edit'))->toBeFalse();
});

test('workspace edit permissions work with Spatie', function () {
    $workspace = Workspace::create([
        'name' => 'Test Workspace',
        'owner_id' => $this->user->id,
        'is_personal' => false,
    ]);

    // Clean other user roles from previous tests
    $this->otherUser->syncRoles([]);

    // Owner can edit planning
    expect($workspace->canUserEditPlanning($this->user))->toBeTrue();

    // User without access cannot edit (not member of workspace)
    expect($workspace->canUserEditPlanning($this->otherUser))->toBeFalse();

    // Editor can edit
    $workspace->users()->attach($this->otherUser->id, [
        'joined_at' => now(),
    ]);
    $workspace->giveEditorPermissions($this->otherUser);
    expect($workspace->canUserEditPlanning($this->otherUser))->toBeTrue();

    // Remove permissions and give viewer permissions
    $workspace->removeUserPermissions($this->otherUser);
    $workspace->giveViewerPermissions($this->otherUser);
    expect($workspace->canUserEditPlanning($this->otherUser))->toBeFalse();
});

test('workspace manage permissions work with Spatie', function () {
    $workspace = Workspace::create([
        'name' => 'Test Workspace',
        'owner_id' => $this->user->id,
        'is_personal' => false,
    ]);

    // Only owner can manage
    expect($workspace->canUserManageWorkspace($this->user))->toBeTrue();

    // Editor cannot manage
    $workspace->users()->attach($this->otherUser->id, [
        'joined_at' => now(),
    ]);
    $workspace->giveEditorPermissions($this->otherUser);
    expect($workspace->canUserManageWorkspace($this->otherUser))->toBeFalse();
});

test('can create personal workspace for new user', function () {
    $newUser = User::factory()->create();
    Workspace::createPersonalWorkspace($newUser);
    $personalWorkspace = $newUser->getPersonalWorkspace();

    expect($personalWorkspace->name)->toBe('Mon espace');
    expect($personalWorkspace->is_personal)->toBeTrue();
    expect($personalWorkspace->owner_id)->toBe($newUser->id);
    expect($personalWorkspace->users)->toHaveCount(1);
    expect($personalWorkspace->users->first()->id)->toBe($newUser->id);
});

test('user model has workspace methods', function () {
    // Create a fresh user without any existing workspaces
    $freshUser = User::factory()->create();
    Workspace::createPersonalWorkspace($freshUser);

    // Get automatically created personal workspace
    $personalWorkspace = $freshUser->getPersonalWorkspace();

    // Create shared workspace
    $sharedWorkspace = Workspace::create([
        'name' => 'Shared Workspace',
        'owner_id' => $this->otherUser->id,
        'is_personal' => false,
    ]);

    // Add user to shared workspace
    $sharedWorkspace->users()->attach($freshUser->id, [
        'joined_at' => now(),
    ]);
    $sharedWorkspace->giveEditorPermissions($freshUser);

    // Test getPersonalWorkspace
    $currentWorkspace = $freshUser->getPersonalWorkspace();
    expect($currentWorkspace->id)->toBe($personalWorkspace->id);

    // Test getAccessibleWorkspaces
    $accessibleWorkspaces = $freshUser->getAccessibleWorkspaces();
    expect($accessibleWorkspaces->count())->toBeGreaterThanOrEqual(2);

    // Personal workspace should come first
    expect($accessibleWorkspaces->first()->is_personal)->toBeTrue();
});
