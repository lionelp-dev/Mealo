<?php

namespace Tests\Feature\Workspace;

use App\Messages\Workspace\WorkspaceCreatedMessage;

use function Pest\Laravel\assertDatabaseHas;

describe('CreateWorkspace', function () {
    test('user cannot create workspace with invalid data', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->user)->post(route('workspaces.store'), [
            'is_personal' => true,
        ]);
        $response->assertStatus(302);
        $response->assertSessionHasErrors(['name']);

        $response = $this->actingAs($this->user)->post(route('workspaces.store'), [
            'name' => str_repeat('a', 256),
            'is_personal' => true,
        ]);
        $response->assertStatus(302);
        $response->assertSessionHasErrors(['name']);

        $response = $this->actingAs($this->user)->post(route('workspaces.store'), [
            'name' => 'Valid Name',
        ]);
        $response->assertStatus(302);
        $response->assertSessionHasErrors(['is_personal']);
    });

    test('user can create a new workspace', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->user)
            ->post(route('workspaces.store'), $this->storeSharedWorkspaceRequestData->transform());

        assertDatabaseHas('workspaces', $this->storeSharedWorkspaceRequestData->transform());

        expect($this->sharedWorkspace->hasUser($this->user))->toBeTrue();
        expect($this->user->hasRole('owner'))->toBeTrue();
        expect($this->user->hasPermissionTo('workspace.manage'))->toBeTrue();

        $response->assertStatus(302);
        $response->assertSessionHas('success', (new WorkspaceCreatedMessage)->getMessage());
    });

    test('user can view their workspaces', function () {
        /** @var \Tests\TestCase $this */
        $this->actingAs($this->user)
            ->get(route('workspaces.index'))
            ->assertOk();
    });
});
