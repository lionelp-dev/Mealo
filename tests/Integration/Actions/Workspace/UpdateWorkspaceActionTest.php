<?php

namespace Tests\Integration\Actions\Workspace;

use App\Actions\Workspace\UpdateWorkspaceAction;
use App\Data\Requests\Workspace\UpdateWorkspaceRequestData;
use App\Data\Resources\Workspace\Entities\WorkspaceResourceData;
use App\Exceptions\Workspace\CannotUpdateWorkspaceException;

use function Pest\Laravel\assertDatabaseHas;

describe('UpdateWorkspaceAction', function () {

    test(
        'cannot update default workspace',
        function () {
            /** @var \Tests\TestCase $this */
            expect(function () {
                app(UpdateWorkspaceAction::class)->execute(
                    $this->defaultWorkspace,
                    UpdateWorkspaceRequestData::from(
                        [
                            ...$this->storePersonalWorkspaceRequestData->transform(),
                            'is_personal' => false,
                        ]
                    )
                );
            })->toThrow(
                CannotUpdateWorkspaceException::class,
            );
        }
    );

    test('can update workspace', function () {
        /** @var \Tests\TestCase $this */
        $this->personalWorkspace = app(UpdateWorkspaceAction::class)->execute(
            $this->personalWorkspace,
            UpdateWorkspaceRequestData::from(
                [
                    ...$this->storePersonalWorkspaceRequestData->transform(),
                    'name' => 'any update workspace',
                ]
            )
        );

        $this->personalWorkspace->fresh();

        assertDatabaseHas('workspaces', WorkspaceResourceData::from($this->personalWorkspace)
            ->except('users_count', 'members', 'pending_invitations')
            ->transform());
    });
});
