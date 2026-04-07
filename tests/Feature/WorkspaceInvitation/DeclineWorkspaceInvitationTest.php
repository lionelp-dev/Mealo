<?php

namespace Tests\Feature\WorkspaceInvitation;

use App\Exceptions\WokspaceInvitation\CannotCancelWorkspaceInvitationException;
use App\Messages\WorkspaceInvitation\InvitationCancelledMessage;
use App\Messages\WorkspaceInvitation\InvitationDeclinedMessage;
use App\Models\WorkspaceInvitation;

describe('DeclineWorkspaceInvitation', function () {
    test('non-owner cannot cancel invitation', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->editorUser)
            ->delete(route('workspace-invitations.destroy', $this->sharedWorkspaceInvitation));

        expect(WorkspaceInvitation::find($this->sharedWorkspaceInvitation->id))->not->toBeNull();

        $response->assertStatus(302);
        $response->assertSessionHas('error', new CannotCancelWorkspaceInvitationException()->getMessage());
    });

    test('can decline expired invitation', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->otherInviteeUser)
            ->post(route('workspace-invitations.decline', $this->sharedWorkspaceExpiredInvitation->token));

        expect(WorkspaceInvitation::find($this->sharedWorkspaceExpiredInvitation->id))->toBeNull();

        $response->assertStatus(302);
        $response->assertSessionHas('success', new InvitationDeclinedMessage()->getMessage());
    });

    test('invited user can decline invitation', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->inviteeUser)
            ->post(route('workspace-invitations.decline', $this->sharedWorkspaceInvitation->token));

        expect($this->sharedWorkspace->fresh()?->hasUser($this->inviteeUser))->toBeFalse();
        expect(WorkspaceInvitation::find($this->sharedWorkspaceInvitation->id))->toBeNull();

        $response->assertStatus(302);
        $response->assertSessionHas('success', new InvitationDeclinedMessage()->getMessage());
    });

    test('workspace owner can cancel invitation', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->user)
            ->delete(route('workspace-invitations.destroy', $this->sharedWorkspaceInvitation));

        expect(WorkspaceInvitation::find($this->sharedWorkspaceInvitation->id))->toBeNull();

        $response->assertStatus(302);
        $response->assertSessionHas('success', new InvitationCancelledMessage()->getMessage());
    });
});
