<?php

namespace Tests\Unit;

use App\Models\User;
use App\Models\Workspace;
use App\Policies\WorkspacePolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;


beforeEach(function () {
    // Seed roles and permissions first
    $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);
    
    $this->policy = new WorkspacePolicy();
    $this->owner = User::factory()->create();
    $this->editor = User::factory()->create();
    $this->viewer = User::factory()->create();
    $this->outsider = User::factory()->create();
    
    $this->workspace = Workspace::create([
        'name' => 'Test Workspace',
        'owner_id' => $this->owner->id,
        'is_personal' => false,
    ]);
    
    // Add members with different roles using Spatie
    $this->workspace->users()->attach($this->editor->id, [
        'joined_at' => now(),
    ]);
    $this->workspace->giveEditorPermissions($this->editor);
    
    $this->workspace->users()->attach($this->viewer->id, [
        'joined_at' => now(),
    ]);
    $this->workspace->giveViewerPermissions($this->viewer);
});

test('any authenticated user can view their workspaces', function () {
    expect($this->policy->viewAny($this->owner))->toBeTrue();
    expect($this->policy->viewAny($this->editor))->toBeTrue();
    expect($this->policy->viewAny($this->viewer))->toBeTrue();
    expect($this->policy->viewAny($this->outsider))->toBeTrue();
});

test('workspace members can view workspace', function () {
    expect($this->policy->view($this->owner, $this->workspace))->toBeTrue();
    expect($this->policy->view($this->editor, $this->workspace))->toBeTrue();
    expect($this->policy->view($this->viewer, $this->workspace))->toBeTrue();
});

test('non-members cannot view workspace', function () {
    expect($this->policy->view($this->outsider, $this->workspace))->toBeFalse();
});

test('any authenticated user can create workspaces', function () {
    expect($this->policy->create($this->owner))->toBeTrue();
    expect($this->policy->create($this->editor))->toBeTrue();
    expect($this->policy->create($this->viewer))->toBeTrue();
    expect($this->policy->create($this->outsider))->toBeTrue();
});

test('only owner can update workspace', function () {
    expect($this->policy->update($this->owner, $this->workspace))->toBeTrue();
    expect($this->policy->update($this->editor, $this->workspace))->toBeFalse();
    expect($this->policy->update($this->viewer, $this->workspace))->toBeFalse();
    expect($this->policy->update($this->outsider, $this->workspace))->toBeFalse();
});

test('only owner can delete non-personal workspace', function () {
    expect($this->policy->delete($this->owner, $this->workspace))->toBeTrue();
    expect($this->policy->delete($this->editor, $this->workspace))->toBeFalse();
    expect($this->policy->delete($this->viewer, $this->workspace))->toBeFalse();
    expect($this->policy->delete($this->outsider, $this->workspace))->toBeFalse();
});

test('cannot delete personal workspace', function () {
    $personalWorkspace = Workspace::create([
        'name' => 'Personal Workspace',
        'owner_id' => $this->owner->id,
        'is_personal' => true,
    ]);
    
    expect($this->policy->delete($this->owner, $personalWorkspace))->toBeFalse();
});

test('only owner can manage members', function () {
    expect($this->policy->manageMember($this->owner, $this->workspace))->toBeTrue();
    expect($this->policy->manageMember($this->editor, $this->workspace))->toBeFalse();
    expect($this->policy->manageMember($this->viewer, $this->workspace))->toBeFalse();
    expect($this->policy->manageMember($this->outsider, $this->workspace))->toBeFalse();
});

test('only owner can send invitations', function () {
    expect($this->policy->invite($this->owner, $this->workspace))->toBeTrue();
    expect($this->policy->invite($this->editor, $this->workspace))->toBeFalse();
    expect($this->policy->invite($this->viewer, $this->workspace))->toBeFalse();
    expect($this->policy->invite($this->outsider, $this->workspace))->toBeFalse();
});

test('owner and editors can edit planning', function () {
    expect($this->policy->editPlanning($this->owner, $this->workspace))->toBeTrue();
    expect($this->policy->editPlanning($this->editor, $this->workspace))->toBeTrue();
    expect($this->policy->editPlanning($this->viewer, $this->workspace))->toBeFalse();
    expect($this->policy->editPlanning($this->outsider, $this->workspace))->toBeFalse();
});