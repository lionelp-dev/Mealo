<?php

namespace Tests\Integration\Actions\WorkspaceInvitation;

use App\Actions\Workspace\WorkspaceInvitationStoreAction;
use App\Data\Requests\Workspace\WorkspaceInvitationStoreRequestData;
use App\Exceptions\WokspaceInvitation\AlreadyExistWorkspaceInvitationException;
use App\Exceptions\Workspace\MemberAlreadyExistWorkspaceException;
use App\Models\WorkspaceInvitation;

use function Pest\Laravel\assertDatabaseHas;

beforeEach(function () {
    /** @var \Tests\TestCase $this */
    $this->setUpSharedWorkspaceContext();
    $this->setUpSharedWorkspaceInvitationContext();
});

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
        $this->sharedWorkspaceInvitation->expires_at = \Carbon\CarbonImmutable::now()->subHour();
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
