<?php

namespace Tests\Integration\Actions\WorkspaceInvitation;

use App\Actions\Workspace\WorkspaceInvitationDeclineAction;

describe('WorkspaceInvitationDeclineAction', function () {
    test('cannot decline an invitation that is not intended for the user', function () {
        /** @var \Tests\TestCase $this */
        expect(function () {
            app(WorkspaceInvitationDeclineAction::class)
                ->execute(
                    $this->thirdInviteeUser,
                    WorkspaceInvitationDeclineRequestData::from([
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
        app(WorkspaceInvitationDeclineAction::class)
            ->execute(
                $this->inviteeUser,
                WorkspaceInvitationDeclineRequestData::from([
                    'token' => $this->sharedWorkspaceInvitation->token,
                ]),
            );

        expect($this->sharedWorkspace->fresh()?->hasUser($this->inviteeUser))->toBeFalse();
        expect(WorkspaceInvitation::find($this->sharedWorkspace->id))->toBeNull();
    });
});
