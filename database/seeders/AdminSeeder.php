<?php

namespace Database\Seeders;

use App\Models\Recipe;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use RuntimeException;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $password = config('app.admin_password');

        if (! is_string($password) || $password === '') {
            return;
        }

        $admin = User::query()->firstOrCreate(
            ['email' => 'admin@mail.com'],
            [
                'name' => 'admin',
                'password' => Hash::make($password),
                'email_verified_at' => Carbon::now(),
            ]
        );

        $workspace = $admin->workspaces()->first();

        if (! $workspace instanceof Workspace) {
            throw new RuntimeException('Admin user has no workspace to scope the admin role to.');
        }

        setPermissionsTeamId($workspace->id);

        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        Permission::query()->firstOrCreate(['name' => 'access-admin-panel']);

        $adminRole = Role::query()->firstOrCreate(['name' => 'admin']);
        $adminRole->givePermissionTo('access-admin-panel');

        $admin->assignRole($adminRole);

        $recipe = Recipe::query()->first();

        if (! $recipe) {
            new RecipeAIGenerationSeeder($admin, true)->run();
        }
    }
}
