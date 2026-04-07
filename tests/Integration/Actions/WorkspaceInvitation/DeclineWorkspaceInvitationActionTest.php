<?php

namespace Tests\Integration\Actions\Workspace;

use App\Actions\Workspace\DeclineWorkspaceInvitationAction;
use App\Data\Requests\Workspace\DeclineWorkspaceInvitationRequestData;
use App\Exceptions\WokspaceInvitation\NotForYouWorkspaceInvitationException;
use App\Models\WorkspaceInvitation;

describe('DeclineWorkspaceInvitationAction', function () {
    test('cannot decline an invitation that is not intended for the user', function () {
        /** @var \Tests\TestCase $this */
        expect(function () {
            app(DeclineWorkspaceInvitationAction::class)
                ->execute(
                    $this->thirdInviteeUser,
                    DeclineWorkspaceInvitationRequestData::from([
                        'token' => $this->sharedWorkspaceInvitation->token,
                    ]),
                );
        })->toThrow(
            NotForYouWorkspaceInvitationException::class,
            'This invitation is not for you'
        );
        expect($this->sharedWorkspace->fresh()?->hasUser($this->inviteeUser))->toBeFalse();
    });

    test('invited user can decline invitation', function () {
        /** @var \Tests\TestCase $this */
        app(DeclineWorkspaceInvitationAction::class)
            ->execute(
                $this->inviteeUser,
                DeclineWorkspaceInvitationRequestData::from([
                    'token' => $this->sharedWorkspaceInvitation->token,
                ]),
            );

        expect($this->sharedWorkspace->fresh()?->hasUser($this->inviteeUser))->toBeFalse();
        expect(WorkspaceInvitation::find($this->sharedWorkspace->id))->toBeNull();
    });
});
