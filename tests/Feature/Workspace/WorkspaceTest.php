<?php

namespace Tests\Feature\Workspace;

use App\Models\User;
use App\Models\Workspace;

beforeEach(function () {

    $this->user = User::factory()->create();
    $this->otherUser = User::factory()->create();
});

test('user can view their workspaces', function () {
    // Get automatically created personal workspace
    $personalWorkspace = $this->user->getPersonalWorkspace();

    // Create shared workspace
    $sharedWorkspace = Workspace::create([
        'name' => 'Shared Workspace',
        'owner_id' => $this->user->id,
        'is_personal' => false,
    ]);

    $response = $this->actingAs($this->user)->get(route('workspaces.index'));

    $response->assertStatus(200);
    $response->assertInertia(
        fn($page) => $page
            ->component('workspaces/index')
            ->has('workspace_data')
            ->has('workspace_data.workspaces')
            ->whereType('workspace_data.workspaces', 'array')
            ->has('workspace_data.current_workspace')
            ->where('workspace_data.current_workspace.is_personal', true)
    );
});

test('user can create a new workspace', function () {
    $workspaceData = [
        'name' => 'My New Workspace',
        'is_personal' => false,
    ];

    $response = $this->actingAs($this->user)->post(route('workspaces.store'), $workspaceData);

    $response->assertStatus(302);
    $response->assertSessionHas('success', 'Workspace created successfully');

    $this->assertDatabaseHas('workspaces', [
        'name' => 'My New Workspace',
        'owner_id' => $this->user->id,
        'is_personal' => false,
    ]);

    // User should be added as owner
    $workspace = Workspace::where('name', 'My New Workspace')->first();
    expect($workspace->hasUser($this->user))->toBeTrue();
    expect($this->user->hasRole('owner'))->toBeTrue();
    expect($this->user->hasPermissionTo("workspace.manage"))->toBeTrue();
});

test('user cannot create workspace with invalid data', function () {
    // Missing name
    $response = $this->actingAs($this->user)->post(route('workspaces.store'), [
        'is_personal' => true,
    ]);
    $response->assertStatus(302);
    $response->assertSessionHasErrors(['name']);

    // Name too long
    $response = $this->actingAs($this->user)->post(route('workspaces.store'), [
        'name' => str_repeat('a', 256),
        'is_personal' => true,
    ]);
    $response->assertStatus(302);
    $response->assertSessionHasErrors(['name']);

    // Missing is_personal
    $response = $this->actingAs($this->user)->post(route('workspaces.store'), [
        'name' => 'Valid Name',
    ]);
    $response->assertStatus(302);
    $response->assertSessionHasErrors(['is_personal']);
});

test('workspace owner can update workspace', function () {
    $workspace = Workspace::create([
        'name' => 'Original Name',
        'owner_id' => $this->user->id,
        'is_personal' => false,
    ]);

    $updateData = [
        'name' => 'Updated Name',
    ];

    $response = $this->actingAs($this->user)->put(route('workspaces.update', $workspace), $updateData);

    $response->assertStatus(302);
    $response->assertSessionHas('success', 'Workspace updated successfully');

    $this->assertDatabaseHas('workspaces', [
        'id' => $workspace->id,
        'name' => 'Updated Name',
    ]);
});

test('non-owner cannot update workspace', function () {
    $workspace = Workspace::create([
        'name' => 'Test Workspace',
        'owner_id' => $this->otherUser->id,
        'is_personal' => false,
    ]);

    $updateData = [
        'name' => 'Hacked Name',
    ];

    $response = $this->actingAs($this->user)->put(route('workspaces.update', $workspace), $updateData);

    $response->assertStatus(403);

    $this->assertDatabaseHas('workspaces', [
        'id' => $workspace->id,
        'name' => 'Test Workspace',
    ]);
});

test('workspace owner can delete non-personal workspace', function () {
    $workspace = Workspace::create([
        'name' => 'Test Workspace',
        'owner_id' => $this->user->id,
        'is_personal' => false,
    ]);

    $response = $this->actingAs($this->user)->delete(route('workspaces.destroy', $workspace));

    $response->assertStatus(302);
    $response->assertSessionHas('success', 'Workspace deleted successfully');

    $this->assertDatabaseMissing('workspaces', [
        'id' => $workspace->id,
    ]);
});

test('cannot delete personal workspace', function () {
    $personalWorkspace = $this->user->getPersonalWorkspace();

    $response = $this->actingAs($this->user)->delete(route('workspaces.destroy', $personalWorkspace));

    $response->assertStatus(403);

    $this->assertDatabaseHas('workspaces', [
        'id' => $personalWorkspace->id,
    ]);
});

test('non-owner cannot delete workspace', function () {
    $workspace = Workspace::create([
        'name' => 'Test Workspace',
        'owner_id' => $this->otherUser->id,
        'is_personal' => false,
    ]);

    $response = $this->actingAs($this->user)->delete(route('workspaces.destroy', $workspace));

    $response->assertStatus(403);

    $this->assertDatabaseHas('workspaces', [
        'id' => $workspace->id,
    ]);
});

test('user can switch to accessible workspace', function () {
    $personalWorkspace = $this->user->getPersonalWorkspace();
    $sharedWorkspace = Workspace::create([
        'name' => 'Shared Workspace',
        'owner_id' => $this->otherUser->id,
        'is_personal' => false,
    ]);

    // Add user to shared workspace
    $sharedWorkspace->users()->attach($this->user->id, [
        'joined_at' => now(),
    ]);
    $sharedWorkspace->giveEditorPermissions($this->user);

    $response = $this->actingAs($this->user)->post(route('workspaces.switch', $sharedWorkspace));

    $response->assertStatus(302);
    $response->assertRedirect();
    $response->assertSessionHas('current_workspace_id', $sharedWorkspace->id);
    $response->assertSessionHas('success', 'Workspace switched successfully');
});

test('user cannot switch to inaccessible workspace', function () {
    $workspace = Workspace::create([
        'name' => 'Private Workspace',
        'owner_id' => $this->otherUser->id,
        'is_personal' => false,
    ]);

    $response = $this->actingAs($this->user)->post(route('workspaces.switch', $workspace));

    $response->assertStatus(403);
});

test('workspace owner can remove member', function () {
    $workspace = Workspace::create([
        'name' => 'Test Workspace',
        'owner_id' => $this->user->id,
        'is_personal' => false,
    ]);

    // Add member
    $workspace->users()->attach($this->otherUser->id, [
        'joined_at' => now(),
    ]);
    $workspace->giveEditorPermissions($this->otherUser);

    $response = $this->actingAs($this->user)->delete(route('workspaces.remove-member', $workspace), [
        'user_id' => $this->otherUser->id,
    ]);

    $response->assertStatus(302);
    $response->assertRedirect();

    expect($workspace->fresh()->hasUser($this->otherUser))->toBeFalse();
});

test('cannot remove workspace owner', function () {
    $workspace = Workspace::create([
        'name' => 'Test Workspace',
        'owner_id' => $this->user->id,
        'is_personal' => false,
    ]);

    $response = $this->actingAs($this->user)->delete(route('workspaces.remove-member', $workspace), [
        'user_id' => $this->user->id,
    ]);

    $response->assertStatus(403);
    $response->assertJson(['message' => 'Cannot remove workspace owner']);
});

test('workspace owner can change member role', function () {
    $workspace = Workspace::create([
        'name' => 'Test Workspace',
        'owner_id' => $this->user->id,
        'is_personal' => false,
    ]);

    // Add member as editor
    $workspace->users()->attach($this->otherUser->id, [
        'joined_at' => now(),
    ]);
    $workspace->giveEditorPermissions($this->otherUser);

    $response = $this->actingAs($this->user)->put(route('workspaces.update-member-role', $workspace), [
        'user_id' => $this->otherUser->id,
        'role' => 'viewer',
    ]);

    $response->assertStatus(302);
    $response->assertRedirect();

    // Check that user now has viewer role and permissions
    expect($this->otherUser->hasRole('viewer'))->toBeTrue();
    expect($this->otherUser->hasPermissionTo('workspace.view'))->toBeTrue();
    expect($this->otherUser->hasPermissionTo('planning.edit'))->toBeFalse();
});

test('cannot change owner role', function () {
    $workspace = Workspace::create([
        'name' => 'Test Workspace',
        'owner_id' => $this->user->id,
        'is_personal' => false,
    ]);

    $response = $this->actingAs($this->user)->put(route('workspaces.update-member-role', $workspace), [
        'user_id' => $this->user->id,
        'role' => 'viewer',
    ]);

    $response->assertStatus(403);
    $response->assertJson(['message' => 'Cannot change owner role']);
});

test('non-owner cannot manage members', function () {
    $workspace = Workspace::create([
        'name' => 'Test Workspace',
        'owner_id' => $this->otherUser->id,
        'is_personal' => false,
    ]);

    // Add user as editor
    $workspace->users()->attach($this->user->id, [
        'joined_at' => now(),
    ]);
    $workspace->giveEditorPermissions($this->user);

    // Try to remove owner
    $response = $this->actingAs($this->user)->delete(route('workspaces.remove-member', $workspace), [
        'user_id' => $this->otherUser->id,
    ]);
    $response->assertStatus(403);

    // Try to change role
    $response = $this->actingAs($this->user)->put(route('workspaces.update-member-role', $workspace), [
        'user_id' => $this->otherUser->id,
        'role' => 'viewer',
    ]);
    $response->assertStatus(403);
});
