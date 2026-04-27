<?php

namespace Tests\Integration\Actions\Workspace;

use App\Actions\Workspace\WorkspaceMemberRoleUpdateAction;

describe('WorkspaceMemberRoleUpdateAction', function () {

    test('cannot change owner role', function () {
        /** @var \Tests\TestCase $this */
        expect(function () {
            app(WorkspaceMemberRoleUpdateAction::class)
                ->execute(
                    $this->personalWorkspace,
                    WorkspaceMemberRoleUpdateRequestData::from([
                        'user_id' => $this->user->id,
                        'role' => 'editor',
                    ]),
                );
        })->toThrow(
            CannotChangeOwnerRoleWorkspaceException::class
        );
    });

    test('cannot change role for user not in workspace', function () {
        /** @var \Tests\TestCase $this */
        expect(function () {
            app(WorkspaceMemberRoleUpdateAction::class)
                ->execute(
                    $this->sharedWorkspace,
                    WorkspaceMemberRoleUpdateRequestData::from([
                        'user_id' => $this->inviteeUser->id,
                        'role' => 'editor',
                    ]),
                );
        })->toThrow(
            MemberNotFoundWorkspaceException::class,
        );
    });

    test('can update member role to editor', function () {
        /** @var \Tests\TestCase $this */
        app(WorkspaceMemberRoleUpdateAction::class)
            ->execute(
                $this->sharedWorkspace,
                WorkspaceMemberRoleUpdateRequestData::from([
                    'user_id' => $this->viewerUser->id,
                    'role' => 'editor',
                ])
            );

        setPermissionsTeamId($this->sharedWorkspace->id);

        expect($this->viewerUser->fresh()?->hasRole('editor'))->toBeTrue();
        expect($this->viewerUser->fresh()?->hasRole('viewer'))->toBeFalse();
    });

    test('can update member role to viewer', function () {
        /** @var \Tests\TestCase $this */
        app(WorkspaceMemberRoleUpdateAction::class)
            ->execute(
                $this->sharedWorkspace,
                WorkspaceMemberRoleUpdateRequestData::from([
                    'user_id' => $this->editorUser->id,
                    'role' => 'viewer',
                ])
            );

        setPermissionsTeamId($this->sharedWorkspace->id);

        expect($this->editorUser->fresh()?->hasRole('viewer'))->toBeTrue();
        expect($this->editorUser->fresh()?->hasRole('editor'))->toBeFalse();
    });
});
