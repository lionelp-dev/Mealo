<?php

namespace Tests\Integration\Actions\Workspace;

use App\Actions\Workspace\DeleteWorkspaceMemberAction;
use App\Data\Requests\Workspace\DeleteWorkspaceMemberRequestData;
use App\Exceptions\Workspace\CannotRemoveOwnerWorkspaceException;
use App\Exceptions\Workspace\MemberNotFoundWorkspaceException;

describe('DeleteWorkspaceMemberAction', function () {

    test('cannot remove workspace owner', function () {
        /** @var \Tests\TestCase $this */
        expect(function () {
            app(DeleteWorkspaceMemberAction::class)
                ->execute(
                    $this->personalWorkspace,
                    DeleteWorkspaceMemberRequestData::from([
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
            app(DeleteWorkspaceMemberAction::class)
                ->execute(
                    $this->sharedWorkspace,
                    DeleteWorkspaceMemberRequestData::from([
                        'user_id' => $this->inviteeUser->id,
                    ]),
                );
        })->toThrow(
            MemberNotFoundWorkspaceException::class
        );
    });

    test('can delete a workspace member', function () {
        /** @var \Tests\TestCase $this */
        app(DeleteWorkspaceMemberAction::class)
            ->execute(
                $this->sharedWorkspace,
                DeleteWorkspaceMemberRequestData::from([
                    'user_id' => $this->viewerUser->id,
                ])
            );

        setPermissionsTeamId($this->sharedWorkspaceInvitation->id);

        expect($this->sharedWorkspace->fresh()?->hasUser($this->viewerUser))->toBeFalse();
        expect($this->viewerUser->fresh()?->hasRole('viewer'))->toBeFalse();
    });
});
