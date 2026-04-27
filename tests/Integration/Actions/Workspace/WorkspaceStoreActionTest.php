<?php

namespace Tests\Integration\Actions\Workspace;

use App\Models\Workspace;

use function Pest\Laravel\assertDatabaseHas;

describe('WorkspaceStoreAction', function () {
    test('belongs to user', function () {
        /** @var \Tests\TestCase $this */
        expect($this->defaultWorkspace)->toBeInstanceOf(Workspace::class)
            ->and($this->defaultWorkspace->owner_id)->toBe($this->user->id)
            ->and($this->defaultWorkspace->owner?->id)->toBe($this->user->id);
    });

    test('can create workspace', function () {
        /** @var \Tests\TestCase $this */
        expect($this->personalWorkspace)->toBeInstanceOf(Workspace::class);
        assertDatabaseHas('workspaces', $this->storePersonalWorkspaceRequestData->transform());
    });

});
