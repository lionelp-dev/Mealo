<?php

namespace App\Actions\Admin;

use App\Models\User;

class UserDeleteAction
{
    /**
     * Delete a user and all their data.
     *
     * recipes.user_id has no cascade: delete recipes first so the
     * RecipeObserver removes their images and planned meals. Deleting the
     * user then cascades demo_accounts, workspaces, planned meals, etc.
     */
    public function execute(User $user): void
    {
        $user->recipes()->cursor()->each(fn (\App\Models\Recipe $recipe) => $recipe->delete());

        $user->delete();
    }
}
