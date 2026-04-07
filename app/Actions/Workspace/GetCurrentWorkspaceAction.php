<?php

namespace App\Actions\Workspace;

use App\Models\User;
use App\Models\Workspace;

class GetCurrentWorkspaceAction
{
    public function __invoke(User $user): Workspace
    {
        $currentWorkspaceId = session('current_workspace_id');

        if ($currentWorkspaceId) {
            $currentWorkspace = $user->workspaces()
                ->where('workspaces.id', $currentWorkspaceId)
                ->first();

            if ($currentWorkspace) {
                return $currentWorkspace;
            }
        }

        /** @var Workspace $defaultWorkspace */
        $defaultWorkspace = $user->workspaces()
            ->where('is_personal', true)
            ->where('is_default', true)
            ->first();

        session(['current_workspace_id' => $defaultWorkspace->id]);

        return $defaultWorkspace;
    }
}
