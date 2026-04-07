<?php

namespace Tests\Feature\WorkspaceInvitation;

use App\Exceptions\WokspaceInvitation\ExpiredWorkspaceInvitationException;
use App\Exceptions\WokspaceInvitation\NotForYouWorkspaceInvitationException;
use App\Exceptions\WokspaceInvitation\NotFoundWorkspaceInvitationException;
use App\Messages\WorkspaceInvitation\InvitationAcceptedMessage;
use App\Models\WorkspaceInvitation;

describe('AcceptWorkspaceInvitation', function () {
    test('cannot accept expired invitation', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->otherInviteeUser)
            ->post(route('workspace-invitations.accept', $this->sharedWorkspaceExpiredInvitation->token));

        expect($this->sharedWorkspace->fresh()?->hasUser($this->otherInviteeUser))->toBeFalse();

        $response->assertStatus(302);
        $response->assertSessionHas('error', new ExpiredWorkspaceInvitationException()->getMessage());
    });

    test('cannot accept invitation for different email', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->otherUser)
            ->post(route('workspace-invitations.accept', $this->sharedWorkspaceInvitation->token));

        expect($this->sharedWorkspace->fresh()?->hasUser($this->otherUser))->toBeFalse();

        $response->assertStatus(302);
        $response->assertSessionHas('error', new NotForYouWorkspaceInvitationException()->getMessage());
    });

    test('cannot accept non-existent invitation', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->inviteeUser)
            ->post(route('workspace-invitations.accept', 'invalid-token'));

        $response->assertStatus(302);
        $response->assertSessionHas('error', new NotFoundWorkspaceInvitationException()->getMessage());
    });

    test('invited user can accept invitation', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->inviteeUser)
            ->post(route('workspace-invitations.accept', $this->sharedWorkspaceInvitation->token));

        expect($this->sharedWorkspace->fresh()?->hasUser($this->inviteeUser))->toBeTrue();
        expect($this->sharedWorkspace->fresh()?->getUserRole($this->inviteeUser))->toBe('editor');
        expect(WorkspaceInvitation::find($this->sharedWorkspaceInvitation->id))->toBeNull();

        $response->assertStatus(302);
        $response->assertSessionHas('success', (new InvitationAcceptedMessage)->getMessage());
    });
});
