<?php

namespace Tests\Integration\Actions\WorkspaceInvitation;

use App\Actions\Workspace\WorkspaceInvitationAcceptAction;
use App\Data\Requests\Workspace\WorkspaceInvitationAcceptRequestData;
use App\Exceptions\WokspaceInvitation\ExpiredWorkspaceInvitationException;
use App\Exceptions\WokspaceInvitation\NotForYouWorkspaceInvitationException;
use App\Models\WorkspaceInvitation;

beforeEach(function () {
    /** @var \Tests\TestCase $this */
    $this->setUpThirdInviteeUserContext();
    $this->setUpSharedWorkspaceInvitationContext();
    $this->setUpSharedWorkspaceExpiredInvitationContext();
});

describe('WorkspaceInvitationAcceptAction', function () {
    test('cannot accept expired invitation', function () {
        /** @var \Tests\TestCase $this */
        expect(function () {
            app(WorkspaceInvitationAcceptAction::class)
                ->execute(
                    $this->otherInviteeUser,
                    WorkspaceInvitationAcceptRequestData::from([
                        'token' => $this->sharedWorkspaceExpiredInvitation->token,
                    ]),
                );
        })->toThrow(
            ExpiredWorkspaceInvitationException::class,
            'This invitation is expired'
        );
    });

    test('cannot accept an invitation that is not intended for the user', function () {
        /** @var \Tests\TestCase $this */
        expect(function () {
            app(WorkspaceInvitationAcceptAction::class)
                ->execute(
                    $this->thirdInviteeUser,
                    WorkspaceInvitationAcceptRequestData::from([
                        'token' => $this->sharedWorkspaceInvitation->token,
                    ]),
                );
        })->toThrow(
            NotForYouWorkspaceInvitationException::class,
            'This invitation is not for you'
        );
        expect($this->sharedWorkspace->fresh()?->hasUser($this->inviteeUser))->toBeFalse();
    });

    test('invited user can accept invitation', function () {
        /** @var \Tests\TestCase $this */
        app(WorkspaceInvitationAcceptAction::class)
            ->execute(
                $this->inviteeUser,
                WorkspaceInvitationAcceptRequestData::from([
                    'token' => $this->sharedWorkspaceInvitation->token,
                ]),
            );

        expect($this->sharedWorkspace->fresh()?->hasUser($this->inviteeUser))->toBeTrue();
        expect($this->sharedWorkspace->fresh()?->getUserRole($this->inviteeUser))->toBe('editor');

        expect(WorkspaceInvitation::find($this->sharedWorkspace->id))->toBeNull();
    });
});
