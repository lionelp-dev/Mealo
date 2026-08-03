<?php

namespace Tests\Feature\WorkspaceInvitation;

use App\Exceptions\WorkspaceInvitation\WorkspaceInvitationCancelAuthorizationException;
use App\Messages\WorkspaceInvitation\InvitationCancelledMessage;
use App\Messages\WorkspaceInvitation\InvitationDeclinedMessage;
use App\Models\WorkspaceInvitation;

beforeEach(function () {
    /** @var \Tests\TestCase $this */
    $this->setUpSharedWorkspaceInvitationContext();
    $this->setUpSharedWorkspaceExpiredInvitationContext();
});

describe('DeclineWorkspaceInvitation', function () {
    test('non-owner cannot cancel invitation', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->editorUser)
            ->delete(route('workspace-invitations.destroy', $this->sharedWorkspaceInvitation));

        expect(WorkspaceInvitation::find($this->sharedWorkspaceInvitation->id))->not->toBeNull();

        $response->assertStatus(302);
        $response->assertSessionHas('error', WorkspaceInvitationCancelAuthorizationException::message());
    });

    test('can decline expired invitation', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->otherInviteeUser)
            ->post(route('workspace-invitations.decline', $this->sharedWorkspaceExpiredInvitation->token));

        expect(WorkspaceInvitation::find($this->sharedWorkspaceExpiredInvitation->id))->toBeNull();

        $response->assertStatus(302);
        $response->assertSessionHas('success', InvitationDeclinedMessage::message());
    });

    test('invited user can decline invitation', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->inviteeUser)
            ->post(route('workspace-invitations.decline', $this->sharedWorkspaceInvitation->token));

        expect($this->sharedWorkspace->fresh()?->hasUser($this->inviteeUser))->toBeFalse();
        expect(WorkspaceInvitation::find($this->sharedWorkspaceInvitation->id))->toBeNull();

        $response->assertStatus(302);
        $response->assertSessionHas('success', InvitationDeclinedMessage::message());
    });

    test('workspace owner can cancel invitation', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->user)
            ->delete(route('workspace-invitations.destroy', $this->sharedWorkspaceInvitation));

        expect(WorkspaceInvitation::find($this->sharedWorkspaceInvitation->id))->toBeNull();

        $response->assertStatus(302);
        $response->assertSessionHas('success', InvitationCancelledMessage::message());
    });
});
