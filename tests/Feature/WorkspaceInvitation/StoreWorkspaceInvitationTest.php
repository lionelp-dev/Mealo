<?php

namespace Tests\Feature\WorkspaceInvitation;

use App\Exceptions\WokspaceInvitation\AlreadyExistWorkspaceInvitationException;
use App\Exceptions\Workspace\MemberAlreadyExistWorkspaceException;
use App\Messages\WorkspaceInvitation\InvitationSentMessage;

use function Pest\Laravel\assertDatabaseHas;

describe('StoreWorkspaceInvitation', function () {
    test('non-owner user cannot send invitation', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->editorUser)
            ->post(
                route('workspace-invitations.store', $this->sharedWorkspace),
                [
                    ...$this->storeOtherSharedWorkspaceInvitationRequestData->transform(),
                    'invited_by' => $this->editorUser->id,
                ]
            );

        $response->assertForbidden();
    });

    test('cannot send invitation with invalid data', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->user)
            ->post(
                route('workspace-invitations.store', $this->sharedWorkspace),
                $this->storeOtherSharedWorkspaceInvitationRequestData->except('email')->transform()
            );
        $response->assertStatus(302);
        $response->assertSessionHasErrors(['email']);

        $response = $this->actingAs($this->user)
            ->post(
                route('workspace-invitations.store', $this->sharedWorkspace),
                [
                    ...$this->storeOtherSharedWorkspaceInvitationRequestData->except('email')->transform(),
                    'email' => 'invalid-email',
                ]
            );

        $response->assertStatus(302);
        $response->assertSessionHasErrors(['email']);

        $response = $this->actingAs($this->user)
            ->post(
                route('workspace-invitations.store', $this->sharedWorkspace),
                [
                    ...$this->storeOtherSharedWorkspaceInvitationRequestData->except('role')->transform(),
                    'role' => 'invalid-role',
                ]
            );
        $response->assertStatus(302);
        $response->assertSessionHasErrors(['role']);

        $response = $this->actingAs($this->user)
            ->post(
                route('workspace-invitations.store', $this->sharedWorkspace),
                [
                    ...$this->storeOtherSharedWorkspaceInvitationRequestData->except('role')->transform(),
                    'role' => 'owner',
                ]
            );
        $response->assertStatus(302);
        $response->assertSessionHasErrors(['role']);
    });

    test('cannot send duplicate invitation', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->user)
            ->post(
                route('workspace-invitations.store', $this->sharedWorkspace),
                $this->storeSharedWorkspaceInvitationRequestData->transform()
            );

        $response->assertRedirect();
        $response->assertSessionHas([
            'error' => new AlreadyExistWorkspaceInvitationException()->getMessage(),
        ]);
    });

    test('cannot invite existing member', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->user)
            ->post(
                route('workspace-invitations.store', $this->sharedWorkspace),
                [
                    ...$this->storeSharedWorkspaceInvitationRequestData->transform(),
                    'email' => $this->editorUser->email,
                ]
            );

        $response->assertRedirect();
        $response->assertSessionHas([
            'error' => new MemberAlreadyExistWorkspaceException()->getMessage(),
        ]);
    });

    test('workspace owner can send invitation', function () {
        /** @var \Tests\TestCase $this */
        $response = $this->actingAs($this->user)
            ->post(
                route('workspace-invitations.store', $this->sharedWorkspace),
                $this->storeOtherSharedWorkspaceInvitationRequestData->transform()
            );

        assertDatabaseHas(
            'workspace_invitations',
            $this->storeOtherSharedWorkspaceInvitationRequestData->transform()
        );

        $response->assertStatus(302);
        $response->assertSessionHas('success', new InvitationSentMessage()->getMessage());
    });

    test('can send invitation after previous one expired', function () {
        /** @var \Tests\TestCase $this */
        $this->sharedWorkspaceInvitation->expires_at = now()->subHour();
        $this->sharedWorkspaceInvitation->save();
        $this->sharedWorkspaceInvitation->fresh();

        $response = $this->actingAs($this->user)
            ->post(
                route('workspace-invitations.store', $this->sharedWorkspace),
                $this->storeSharedWorkspaceInvitationRequestData->transform(),
            );

        $response->assertStatus(302);
        $response->assertSessionHas('success', new InvitationSentMessage()->getMessage());
    });
});
