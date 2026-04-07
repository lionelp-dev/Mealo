<?php

namespace App\Actions\Workspace;

use App\Data\Requests\Workspace\StoreWorkspaceRequestData;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Support\Facades\DB;

class StoreWorkspaceAction
{
    /**
     * Create a new workspace.
     */
    public function execute(User $user, StoreWorkspaceRequestData $workspaceData): Workspace
    {
        return DB::transaction(function () use ($user, $workspaceData): Workspace {
            return Workspace::create([
                'name' => $workspaceData->name,
                'owner_id' => $user->id,
                'is_personal' => $workspaceData->is_personal,
                'is_default' => false,
            ]);
        });
    }
}
