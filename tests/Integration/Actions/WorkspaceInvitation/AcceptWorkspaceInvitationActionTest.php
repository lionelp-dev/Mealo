<?php

namespace Tests\Integration\Actions\Worspace;

use App\Actions\Workspace\AcceptWorkspaceInvitationAction;
use App\Data\Requests\Workspace\AcceptWorkspaceInvitationRequestData;
use App\Exceptions\WokspaceInvitation\ExpiredWorkspaceInvitationException;
use App\Exceptions\WokspaceInvitation\NotForYouWorkspaceInvitationException;
use App\Models\WorkspaceInvitation;

describe('AcceptWorkspaceInvitationAction', function () {
    test('cannot accept expired invitation', function () {
        /** @var \Tests\TestCase $this */
        expect(function () {
            app(AcceptWorkspaceInvitationAction::class)
                ->execute(
                    $this->inviteeUser,
                    AcceptWorkspaceInvitationRequestData::from([
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
            app(AcceptWorkspaceInvitationAction::class)
                ->execute(
                    $this->thirdInviteeUser,
                    AcceptWorkspaceInvitationRequestData::from([
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
        app(AcceptWorkspaceInvitationAction::class)
            ->execute(
                $this->inviteeUser,
                AcceptWorkspaceInvitationRequestData::from([
                    'token' => $this->sharedWorkspaceInvitation->token,
                ]),
            );

        expect($this->sharedWorkspace->fresh()?->hasUser($this->inviteeUser))->toBeTrue();
        expect($this->sharedWorkspace->fresh()?->getUserRole($this->inviteeUser))->toBe('editor');

        expect(WorkspaceInvitation::find($this->sharedWorkspace->id))->toBeNull();
    });
});
