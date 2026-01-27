<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Workspace;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $owner = User::query()->firstOrCreate(
            ['email' => 'owner@mail.com'],
            [
                'name' => 'owner',
                'password' => Hash::make('password'),
                'email_verified_at' => Carbon::now(),
            ]
        );


        $editor = User::query()->firstOrCreate(
            ['email' => 'editor@mail.com'],
            [
                'name' => 'editor',
                'password' => Hash::make('password'),
                'email_verified_at' => Carbon::now(),
            ]
        );

        $viewer = User::query()->firstOrCreate(
            ['email' => 'viewer@mail.com'],
            [
                'name' => 'viewer',
                'password' => Hash::make('password'),
                'email_verified_at' => Carbon::now(),
            ]
        );


        $sharedWorkspace = Workspace::create([
            'name' => 'Test Shared Workspace',
            'description' => 'A workspace for testing collaboration features',
            'owner_id' => $owner->id,
            'is_personal' => false,
        ]);

        // Add users to workspace and assign Spatie permissions
        $sharedWorkspace->users()->attach([
            $editor->id => [
                'joined_at' => now(),
            ],
            $viewer->id => [
                'joined_at' => now(),
            ],
        ]);

        // Give appropriate Spatie permissions
        $sharedWorkspace->giveEditorPermissions($editor);
        $sharedWorkspace->giveViewerPermissions($viewer);


        new AIRecipeSeeder($owner)->run();

        new AIRecipeSeeder($editor)->run();

        new AIRecipeSeeder($viewer)->run();
    }
}
