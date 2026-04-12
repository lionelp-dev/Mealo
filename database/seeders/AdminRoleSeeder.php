<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class AdminRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        Permission::query()->firstOrCreate(['name' => 'access-admin-panel']);

        $adminRole = Role::query()->firstOrCreate(['name' => 'admin']);
        $adminRole->givePermissionTo('access-admin-panel');

        $admin = User::query()->firstOrCreate(
            ['email' => 'admin@mail.com'],
            [
                'name' => 'admin',
                'password' => Hash::make('password'),
                'email_verified_at' => Carbon::now(),
            ]
        );

        // Create personal workspace for admin if it doesn't exist
        if (! $admin->workspaces()->exists()) {
            \App\Models\Workspace::createPersonalWorkspace($admin);
        }

        // Assign admin role within the workspace context
        $workspace = $admin->workspaces()->first();
        setPermissionsTeamId($workspace->id);
        $admin->assignRole('admin');
    }
}
