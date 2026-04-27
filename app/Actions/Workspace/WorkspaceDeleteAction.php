<?php

namespace App\Actions\Workspace;

use App\Models\Workspace;
use Illuminate\Support\Facades\DB;

class WorkspaceDeleteAction
{
    /**
     * Delete a workspace and clean up all associated data including Spatie permissions.
     */
    public function execute(Workspace $workspace): void
    {
        DB::transaction(function () use ($workspace) {
            $members = $workspace->users()->get();

            setPermissionsTeamId($workspace->id);

            foreach ($members as $member) {
                $workspace->removeUserPermissions($member);
            }

            $workspace->delete();
        });
    }
}
