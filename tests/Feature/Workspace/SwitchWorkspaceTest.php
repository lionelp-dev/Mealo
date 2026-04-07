<?php

namespace Tests\Feature\Workspace;

use App\Exceptions\Workspace\CannotViewWorkspaceException;
use App\Messages\Workspace\WorkspaceSwitchedMessage;

describe('SwitchWorkspace', function () {
    test('user cannot switch to inaccessible workspace', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->user)
            ->post(route('workspaces.switch', $this->otherUserSharedWorkspace));

        $response->assertStatus(302);
        $response->assertSessionHas('error', new CannotViewWorkspaceException()->getMessage());
    });

    test('user can switch to accessible workspace', function () {
        /** @var \Tests\TestCase $this */
        $this->otherUserSharedWorkspace->users()->attach($this->user->id, [
            'joined_at' => now(),
        ]);
        $this->otherUserSharedWorkspace->giveEditorPermissions($this->user);
        $this->otherUserSharedWorkspace->fresh();

        $response = $this->actingAs($this->user)
            ->post(route('workspaces.switch', $this->otherUserSharedWorkspace));

        $response->assertStatus(302);
        $response->assertSessionHas('success', (new WorkspaceSwitchedMessage)->getMessage());
        $response->assertSessionHas('current_workspace_id', $this->otherUserSharedWorkspace->id);
    });
});
