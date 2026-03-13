<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Create the initial roles and permissions.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Créer les permissions
        $permissions = [
            'workspace.view',
            'workspace.edit',
            'workspace.manage',
            'workspace.planned-meal.create',
            'workspace.planned-meal.update',
            'workspace.planned-meal.view',
            'workspace.planned-meal.destroy',
            'planning.edit',
        ];

        foreach ($permissions as $permissionName) {
            Permission::query()->firstOrCreate(['name' => $permissionName]);
        }

        $ownerRole = Role::query()->firstOrCreate(['name' => 'owner']);
        $ownerRole->givePermissionTo('workspace.view');
        $ownerRole->givePermissionTo('workspace.edit');
        $ownerRole->givePermissionTo('workspace.manage');
        $ownerRole->givePermissionTo('workspace.planned-meal.create');
        $ownerRole->givePermissionTo('workspace.planned-meal.update');
        $ownerRole->givePermissionTo('workspace.planned-meal.view');
        $ownerRole->givePermissionTo('workspace.planned-meal.destroy');
        $ownerRole->givePermissionTo('planning.edit');

        $editorRole = Role::query()->firstOrCreate(['name' => 'editor']);
        $editorRole->givePermissionTo('workspace.view');
        $editorRole->givePermissionTo('workspace.planned-meal.create');
        $editorRole->givePermissionTo('workspace.planned-meal.update');
        $editorRole->givePermissionTo('workspace.planned-meal.view');
        $editorRole->givePermissionTo('workspace.planned-meal.destroy');
        $editorRole->givePermissionTo('planning.edit');

        $viewerRole = Role::query()->firstOrCreate(['name' => 'viewer']);
        $viewerRole->givePermissionTo('workspace.view');
    }
}
