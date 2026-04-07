<?php

namespace Tests\Feature\Workspace;

use App\Exceptions\Workspace\CannotDeleteWorkspaceException;
use App\Messages\Workspace\WorkspaceDeletedMessage;
use App\Models\Workspace;

describe('DeleteWorkspace', function () {
    test('cannot delete default workspace', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->user)->delete(route('workspaces.destroy', $this->defaultWorkspace));

        expect(Workspace::find($this->defaultWorkspace->id))->not->toBeNull();
        $response->assertSessionHas('error', new CannotDeleteWorkspaceException()->getMessage());
    });

    test('non-owner cannot delete workspace', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->otherUser)->delete(route('workspaces.destroy', $this->sharedWorkspace));

        expect(Workspace::find($this->sharedWorkspace->id))->not->toBeNull();

        $response->assertStatus(302);
        $response->assertSessionHas('error', new CannotDeleteWorkspaceException()->getMessage());
    });

    test('owner can delete shared workspace', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->user)->delete(route('workspaces.destroy', $this->sharedWorkspace));

        expect(Workspace::find($this->sharedWorkspace->id))->toBeNull();

        $response->assertStatus(302);
        $response->assertSessionHas('success', new WorkspaceDeletedMessage()->getMessage());
    });
});
