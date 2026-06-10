<?php

use App\Models\BetaRequest;
use App\Models\Recipe;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    // Set team context to null for global permissions
    setPermissionsTeamId(null);

    // Create admin role and permission (GLOBAL - no workspace)
    Permission::create(['name' => 'access-admin-panel']);
    $this->adminRole = Role::create(['name' => 'admin']);
    $this->adminRole->givePermissionTo('access-admin-panel');
});

it('allows admins to access dashboard', function () {
    $admin = User::factory()->create();

    // Set team ID to null before assigning global role
    setPermissionsTeamId(null);
    $admin->assignRole('admin');

    $response = actingAs($admin)->get('/admin');

    $response->assertSuccessful();
    $response->assertInertia(fn($page) => $page
        ->component('admin/dashboard')
        ->has('stats'));
});

it('prevents non-admins from accessing dashboard', function () {
    $user = User::factory()->create();

    $response = actingAs($user)->get('/admin');

    $response->assertForbidden();
});
