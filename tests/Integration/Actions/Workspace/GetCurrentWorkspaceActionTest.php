<?php

namespace Tests\Integration\Actions\Workspace;

use App\Actions\Workspace\DeleteWorkspaceMemberAction;
use App\Actions\Workspace\GetCurrentWorkspaceAction;
use App\Data\Requests\Workspace\DeleteWorkspaceMemberRequestData;

use function Pest\Laravel\actingAs;

describe('GetCurrentWorkspaceAction', function () {
    test('return current workspace when user has access', function () {
        /** @var \Tests\TestCase $this */
        actingAs($this->user)->withSession(['current_workspace_id' => $this->sharedWorkspace->id]);

        $currentWorkspace = app(GetCurrentWorkspaceAction::class)($this->user);

        expect($currentWorkspace->id)->toBe($this->sharedWorkspace->id);
        expect(session('current_workspace_id'))->toBe($this->sharedWorkspace->id);
    });

    test('switches to personal workspace when access is lost', function () {
        /** @var \Tests\TestCase $this */
        actingAs($this->editorUser)->withSession(['current_workspace_id' => $this->sharedWorkspace->id]);

        app(DeleteWorkspaceMemberAction::class)->execute(
            $this->sharedWorkspace,
            DeleteWorkspaceMemberRequestData::from(
                [
                    'user_id' => $this->editorUser->id,
                ]
            )
        );

        $currentWorkspace = app(GetCurrentWorkspaceAction::class)($this->editorUser);
        $editorDefaultWorkspace = $this->editorUser->workspaces()->where('is_default', true)->first();

        expect($currentWorkspace->id)->toBe($editorDefaultWorkspace?->id);
        expect(session('current_workspace_id'))->toBe($editorDefaultWorkspace?->id);
    });

});
