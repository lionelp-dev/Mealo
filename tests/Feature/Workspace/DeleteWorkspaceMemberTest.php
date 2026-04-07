<?php

namespace Tests\Feature\Workspace;

use App\Exceptions\Workspace\CannotDeleteMemberWorkspaceException;
use App\Exceptions\Workspace\CannotRemoveOwnerWorkspaceException;
use App\Exceptions\Workspace\CannotUpdateMemberWorkspaceException;
use App\Messages\Workspace\MemberRemovedMessage;

describe('DeleteWorkspaceMember', function () {
    test('cannot remove workspace owner', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->user)
            ->delete(route('workspaces.remove-member', $this->sharedWorkspace), [
                'user_id' => $this->user->id,
            ]);

        $response->assertStatus(302);
        $response->assertSessionHas('error', new CannotRemoveOwnerWorkspaceException()->getMessage());
    });

    test('non-owner cannot delete member', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->editorUser)->delete(route('workspaces.remove-member', $this->sharedWorkspace), [
            'user_id' => $this->viewerUser->id,
        ]);

        $response->assertStatus(302);
        $response->assertSessionHas('error', new CannotDeleteMemberWorkspaceException()->getMessage());
    });

    test('non-owner cannot update member role', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->viewerUser)->put(route('workspaces.update-member-role', $this->sharedWorkspace), [
            'user_id' => $this->editorUser->id,
            'role' => 'viewer',
        ]);

        $response->assertStatus(302);
        $response->assertSessionHas('error', new CannotUpdateMemberWorkspaceException()->getMessage());
    });

    test('workspace owner can delete member', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->user)->delete(route('workspaces.remove-member', $this->sharedWorkspace), [
            'user_id' => $this->editorUser->id,
        ]);

        expect($this->sharedWorkspace->fresh()?->hasUser($this->editorUser))->toBeFalse();

        $response->assertStatus(302);
        $response->assertSessionHas('success', (new MemberRemovedMessage)->getMessage());
    });
});
