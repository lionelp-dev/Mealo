<?php

namespace Tests\Feature\Workspace;

use App\Exceptions\Workspace\WorkspaceMemberDeleteAuthorizationException;
use App\Exceptions\Workspace\WorkspaceMemberUpdateAuthorizationException;
use App\Exceptions\Workspace\WorkspaceOwnerRemoveAuthorizationException;
use App\Messages\Workspace\MemberRemovedMessage;

beforeEach(function () {
    /** @var \Tests\TestCase $this */
    $this->setUpSharedWorkspaceContext();
});

describe('DeleteWorkspaceMember', function () {
    test('cannot remove workspace owner', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->user)
            ->delete(route('workspaces.remove-member', $this->sharedWorkspace), [
                'user_id' => $this->user->id,
            ]);

        $response->assertStatus(302);
        $response->assertSessionHas('error', WorkspaceOwnerRemoveAuthorizationException::message());
    });

    test('non-owner cannot delete member', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->editorUser)->delete(route('workspaces.remove-member', $this->sharedWorkspace), [
            'user_id' => $this->viewerUser->id,
        ]);

        $response->assertStatus(302);
        $response->assertSessionHas('error', WorkspaceMemberDeleteAuthorizationException::message());
    });

    test('non-owner cannot update member role', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->viewerUser)->put(route('workspaces.update-member-role', $this->sharedWorkspace), [
            'user_id' => $this->editorUser->id,
            'role' => 'viewer',
        ]);

        $response->assertStatus(302);
        $response->assertSessionHas('error', WorkspaceMemberUpdateAuthorizationException::message());
    });

    test('workspace owner can delete member', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->user)->delete(route('workspaces.remove-member', $this->sharedWorkspace), [
            'user_id' => $this->editorUser->id,
        ]);

        expect($this->sharedWorkspace->fresh()?->hasUser($this->editorUser))->toBeFalse();

        $response->assertStatus(302);
        $response->assertSessionHas('success', MemberRemovedMessage::message());
    });
});
