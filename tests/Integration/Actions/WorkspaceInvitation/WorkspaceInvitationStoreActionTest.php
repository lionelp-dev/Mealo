<?php

namespace Tests\Integration\Actions\WorkspaceInvitation;

use App\Actions\Workspace\WorkspaceInvitationStoreAction;

describe('WorkspaceInvitationStoreAction', function () {

    test('cannot send duplicate invitation', function () {
        /** @var \Tests\TestCase $this */
        expect(function () {
            app(WorkspaceInvitationStoreAction::class)
                ->execute(
                    $this->user,
                    $this->sharedWorkspace,
                    $this->storeSharedWorkspaceInvitationRequestData
                );
        })->toThrow(
            AlreadyExistWorkspaceInvitationException::class
        );
    });

    test('cannot invite existing member', function () {
        /** @var \Tests\TestCase $this */
        expect(function () {
            app(WorkspaceInvitationStoreAction::class)
                ->execute(
                    $this->user,
                    $this->sharedWorkspace,
                    WorkspaceInvitationStoreRequestData::from(
                        [
                            ...$this->storeSharedWorkspaceInvitationRequestData->transform(),
                            'email' => $this->editorUser->email,
                        ]
                    )
                );
        })->toThrow(
            MemberAlreadyExistWorkspaceException::class
        );
    });

    test('can create workspace invitation', function () {
        /** @var \Tests\TestCase $this */
        expect($this->sharedWorkspaceInvitation)->toBeInstanceOf(WorkspaceInvitation::class);
        assertDatabaseHas('workspace_invitations', $this->storeSharedWorkspaceInvitationRequestData->transform());
    });

    test('can create invitation after previous one expired', function () {
        /** @var \Tests\TestCase $this */
        $this->sharedWorkspaceInvitation->expires_at = now()->subHour();
        $this->sharedWorkspaceInvitation->save();
        $this->sharedWorkspaceInvitation->fresh();

        app(WorkspaceInvitationStoreAction::class)
            ->execute(
                $this->user,
                $this->sharedWorkspace,
                WorkspaceInvitationStoreRequestData::from(
                    $this->storeSharedWorkspaceInvitationRequestData->transform(),
                )
            );

        $invitations = WorkspaceInvitation::where('email', $this->sharedWorkspaceInvitation->email)->get();
        expect($invitations)->toHaveCount(2);
    });
});
