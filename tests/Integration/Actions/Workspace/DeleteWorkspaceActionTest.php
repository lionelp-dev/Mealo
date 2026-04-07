<?php

namespace Tests\Integration\Actions\Workspace;

use App\Actions\Workspace\DeleteWorkspaceAction;
use App\Models\PlannedMeal;
use App\Models\Workspace;
use App\Models\WorkspaceInvitation;

use function Pest\Laravel\assertDatabaseMissing;

describe('DeleteWorkspaceAction', function () {
    test('can delete workspace successfully', function () {
        /** @var \Tests\TestCase $this */
        app(DeleteWorkspaceAction::class)->execute($this->sharedWorkspace);

        expect(Workspace::find($this->sharedWorkspace->id))->toBeNull();
    });

    test('can delete workspace and removes all member permissions', function () {
        /** @var \Tests\TestCase $this */
        expect($this->user->hasRole('owner'))->toBeTrue();
        expect($this->editorUser->hasRole('editor'))->toBeTrue();
        expect($this->viewerUser->hasRole('viewer'))->toBeTrue();

        $deleteSharedWorkspaceID = $this->sharedWorkspace->id;

        app(DeleteWorkspaceAction::class)->execute($this->sharedWorkspace);

        setPermissionsTeamId($deleteSharedWorkspaceID);
        expect(Workspace::find($deleteSharedWorkspaceID))->toBeNull();

        expect($this->user->fresh()?->hasRole('owner'))->toBeFalse();
        expect($this->editorUser->fresh()?->hasRole('editor'))->toBeFalse();
        expect($this->viewerUser->fresh()?->hasRole('viewer'))->toBeFalse();
    });

    test('cascade delete workspace_users via database constraints', function () {
        /** @var \Tests\TestCase $this */
        expect($this->sharedWorkspace->users()->count())->toBe(3);

        $deleteSharedWorkspaceID = $this->sharedWorkspace->id;

        app(DeleteWorkspaceAction::class)->execute($this->sharedWorkspace);

        assertDatabaseMissing('workspace_users', [
            'workspace_id' => $deleteSharedWorkspaceID,
        ]);
    });

    test('cascade delete workspace invitations via database constraints', function () {
        /** @var \Tests\TestCase $this */
        $deleteSharedWorkspaceID = $this->sharedWorkspaceInvitation->id;
        app(DeleteWorkspaceAction::class)->execute($this->sharedWorkspace);

        expect(WorkspaceInvitation::find($deleteSharedWorkspaceID))->toBeNull();
    });

    test('cascade delete planned meals via database constraints', function () {
        /** @var \Tests\TestCase $this */
        $plannedMeal = PlannedMeal::factory()
            ->for($this->user)
            ->for($this->sharedWorkspace)
            ->create();

        app(DeleteWorkspaceAction::class)->execute($this->sharedWorkspace);

        expect(PlannedMeal::find($plannedMeal->id))->toBeNull();
    });

});
