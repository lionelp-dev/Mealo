<?php

namespace Tests\Integration\Actions\Workspace;

use App\Actions\Workspace\WorkspaceMemberDeleteAction;

describe('WorkspaceMemberDeleteAction', function () {

    test('cannot remove workspace owner', function () {
        /** @var \Tests\TestCase $this */
        expect(function () {
            app(WorkspaceMemberDeleteAction::class)
                ->execute(
                    $this->personalWorkspace,
                    WorkspaceMemberDeleteRequestData::from([
                        'user_id' => $this->user->id,
                    ]),
                );
        })->toThrow(
            CannotRemoveOwnerWorkspaceException::class,
        );
    });

    test('cannot delete a user who does not exist in this workspace', function () {
        /** @var \Tests\TestCase $this */
        expect(function () {
            app(WorkspaceMemberDeleteAction::class)
                ->execute(
                    $this->sharedWorkspace,
                    WorkspaceMemberDeleteRequestData::from([
                        'user_id' => $this->inviteeUser->id,
                    ]),
                );
        })->toThrow(
            MemberNotFoundWorkspaceException::class
        );
    });

    test('can delete a workspace member', function () {
        /** @var \Tests\TestCase $this */
        app(WorkspaceMemberDeleteAction::class)
            ->execute(
                $this->sharedWorkspace,
                WorkspaceMemberDeleteRequestData::from([
                    'user_id' => $this->viewerUser->id,
                ])
            );

        setPermissionsTeamId($this->sharedWorkspaceInvitation->id);

        expect($this->sharedWorkspace->fresh()?->hasUser($this->viewerUser))->toBeFalse();
        expect($this->viewerUser->fresh()?->hasRole('viewer'))->toBeFalse();
    });
});
