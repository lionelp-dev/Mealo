<?php

namespace App\Actions\Workspace;

use App\Data\Requests\Workspace\WorkspaceUpdateRequestData;
use App\Exceptions\Workspace\CannotUpdateWorkspaceException;
use App\Models\Workspace;
use Illuminate\Support\Facades\DB;

class WorkspaceUpdateAction
{
    /**
     * Update a workspace.
     */
    public function execute(Workspace $workspace, WorkspaceUpdateRequestData $workspaceData): Workspace
    {
        if (
            $workspaceData->is_personal !== null
            && $workspaceData->is_personal !== $workspace->is_personal
            && $workspace->is_default
        ) {
            throw new CannotUpdateWorkspaceException;
        }

        $convertingToPersonal = $workspaceData->is_personal === true;

        return DB::transaction(function () use ($workspace, $workspaceData, $convertingToPersonal): Workspace {
            $workspace->update(array_filter([
                'name' => $workspaceData->name,
                'is_personal' => $workspaceData->is_personal,
            ], fn ($value) => $value !== null));

            if ($convertingToPersonal) {
                $workspace->removeAllNonOwnerMembers();
                $workspace->invitations()->delete();
            }

            return $workspace;
        });
    }
}
