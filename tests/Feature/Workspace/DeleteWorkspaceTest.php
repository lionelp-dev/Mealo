<?php

namespace Tests\Feature\Workspace;

use App\Exceptions\Workspace\WorkspaceDeleteAuthorizationException;
use App\Messages\Workspace\WorkspaceDeletedMessage;
use App\Models\Workspace;

beforeEach(function () {
    /** @var \Tests\TestCase $this */
    $this->setUpOtherUserContext();
    $this->setUpSharedWorkspaceContext();
});

describe('DeleteWorkspace', function () {
    test('cannot delete default workspace', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->user)->delete(route('workspaces.destroy', $this->user->defaultWorkspace()));

        expect(Workspace::find($this->user->defaultWorkspace()->id))->not->toBeNull();
        $response->assertSessionHas('error', WorkspaceDeleteAuthorizationException::message());
    });

    test('non-owner cannot delete workspace', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->otherUser)->delete(route('workspaces.destroy', $this->sharedWorkspace));

        expect(Workspace::find($this->sharedWorkspace->id))->not->toBeNull();

        $response->assertStatus(302);
        $response->assertSessionHas('error', WorkspaceDeleteAuthorizationException::message());
    });

    test('owner can delete shared workspace', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->user)->delete(route('workspaces.destroy', $this->sharedWorkspace));

        expect(Workspace::find($this->sharedWorkspace->id))->toBeNull();

        $response->assertStatus(302);
        $response->assertSessionHas('success', WorkspaceDeletedMessage::message());
    });
});
