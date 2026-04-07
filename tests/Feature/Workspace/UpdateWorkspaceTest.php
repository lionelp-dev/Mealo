<?php

namespace Tests\Feature\Workspace;

use App\Exceptions\Workspace\CannotChangeOwnerRoleWorkspaceException;
use App\Exceptions\Workspace\CannotUpdateWorkspaceException;
use App\Messages\Workspace\MemberRoleUpdatedMessage;
use App\Messages\Workspace\WorkspaceUpdatedMessage;
use App\Models\WorkspaceInvitation;

use function Pest\Laravel\assertDatabaseHas;

describe('UpdateWorkspace', function () {
    test('non-owner cannot update workspace', function () {
        /** @var \Tests\TestCase $this */
        $updateData = [
            'name' => 'Any new Name',
        ];

        $response = $this->actingAs($this->editorUser)->put(
            route('workspaces.update', $this->sharedWorkspace),
            $updateData
        );

        assertDatabaseHas('workspaces', [
            ...$updateData,
            'name' => $this->sharedWorkspace->name,
        ]);

        $response->assertStatus(302);
        $response->assertSessionHas('error', new CannotUpdateWorkspaceException()->getMessage());
    });

    test('cannot update default workspace', function () {
        /** @var \Tests\TestCase $this */
        $update = [
            'name' => 'any new name',
        ];

        $response = $this->actingAs($this->user)->put(
            route('workspaces.update', $this->defaultWorkspace),
            $update
        );

        $response->assertStatus(302);
        $response->assertSessionHas('error', new CannotUpdateWorkspaceException()->getMessage());
    });

    test('non-owner cannot update workspace type', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->editorUser)->put(
            route('workspaces.update', $this->sharedWorkspace),
            [
                'name' => $this->sharedWorkspace->name,
                'is_personal' => true,
            ]
        );

        $response->assertStatus(302);
        $response->assertSessionHas('error', new CannotUpdateWorkspaceException()->getMessage());
    });

    test('cannot change owner role', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->user)->put(
            route('workspaces.update-member-role', $this->sharedWorkspace),
            [
                'user_id' => $this->user->id,
                'role' => 'viewer',
            ]
        );

        $response->assertStatus(302);
        $response->assertSessionHas('error', new CannotChangeOwnerRoleWorkspaceException()->getMessage());
    });

    test('cannot change is_personal on default workspace', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->user)->put(
            route('workspaces.update', $this->defaultWorkspace),
            [
                'name' => 'Default Workspace',
                'is_personal' => false,
            ]
        );

        $this->defaultWorkspace->refresh();

        expect($this->defaultWorkspace->is_personal)->toBeTrue();

        $response->assertStatus(302);
        $response->assertSessionHas('error', new CannotUpdateWorkspaceException()->getMessage());
    });

    test('owner can update workspace name', function () {
        /** @var \Tests\TestCase $this */
        $updateData = [
            'name' => 'Any new Name',
        ];

        $response = $this->actingAs($this->user)->put(
            route('workspaces.update', $this->sharedWorkspace),
            $updateData
        );

        assertDatabaseHas('workspaces', [
            ...$updateData,
            'id' => $this->sharedWorkspace->id,
        ]);

        $response->assertStatus(302);
        $response->assertSessionHas('success', new WorkspaceUpdatedMessage()->getMessage());
    });

    test('owner can change member role', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->user)->put(
            route('workspaces.update-member-role', $this->sharedWorkspace),
            [
                'user_id' => $this->editorUser->id,
                'role' => 'viewer',
            ]
        );

        expect($this->editorUser->hasRole('viewer'))->toBeTrue();
        expect($this->editorUser->hasPermissionTo('workspace.view'))->toBeTrue();
        expect($this->editorUser->hasPermissionTo('planning.edit'))->toBeFalse();

        $response->assertStatus(302);
        $response->assertSessionHas('success', new MemberRoleUpdatedMessage()->getMessage());
    });

    test('converts shared workspace to personal and removes non-owner members', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->user)->put(
            route('workspaces.update', $this->sharedWorkspace),
            [
                'name' => $this->sharedWorkspace->name,
                'is_personal' => true,
            ]
        );

        $this->sharedWorkspace->refresh();

        expect($this->sharedWorkspace->is_personal)->toBeTrue();
        expect($this->sharedWorkspace->users()->where('user_id', $this->thirdUser->id)->exists())->toBeFalse();
        expect($this->sharedWorkspace->users()->where('user_id', $this->user->id)->exists())->toBeTrue();

        $response->assertStatus(302);
        $response->assertSessionHas('success', new WorkspaceUpdatedMessage()->getMessage());
    });

    test('cancels pending invitations when converting to personal', function () {
        /** @var \Tests\TestCase $this */
        $this->actingAs($this->user)->put(
            route('workspaces.update', $this->sharedWorkspace),
            [
                'name' => $this->sharedWorkspace->name,
                'is_personal' => true,
            ]
        );

        expect(WorkspaceInvitation::where('workspace_id', $this->sharedWorkspace->id)->count())->toBe(0);
    });

    test('keeps the owner as member when converting to personal', function () {
        /** @var \Tests\TestCase $this */
        $this->actingAs($this->user)->put(
            route('workspaces.update', $this->sharedWorkspace),
            [
                'name' => $this->sharedWorkspace->name,
                'is_personal' => true,
            ]
        );

        expect($this->sharedWorkspace->users()->where('user_id', $this->user->id)->exists())->toBeTrue();
    });

    test('does not remove members when only updating the name', function () {
        /** @var \Tests\TestCase $this */
        $this->actingAs($this->user)->put(
            route('workspaces.update', $this->sharedWorkspace),
            [
                'name' => 'any new name',
            ]
        );

        expect($this->sharedWorkspace->users()->where('user_id', $this->editorUser->id)->exists())->toBeTrue();
    });

    test('does not trigger cleanup when workspace is already personal', function () {
        /** @var \Tests\TestCase $this */
        $this->actingAs($this->user)->put(
            route('workspaces.update', $this->personalWorkspace),
            [
                'name' => 'Personal Workspace',
                'is_personal' => true,
            ]
        );

        expect($this->personalWorkspace->users()->where('user_id', $this->user->id)->exists())->toBeTrue();
    });

});
