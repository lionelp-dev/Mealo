<?php

use App\Models\User;
use App\Models\Workspace;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    /** @var \Tests\TestCase $this */
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
    $response->assertInertia(fn ($page) => $page
        ->component('admin/dashboard')
        ->has('stats'));
});

it('allows admins whose role is assigned within a workspace context', function () {
    // Mirrors the production seeder: the role lives in a workspace-scoped pivot,
    // while the admin panel gate resolves access globally via User::isAdmin().
    $admin = User::factory()->create();
    $workspace = Workspace::createPersonalWorkspace($admin);

    setPermissionsTeamId($workspace->id);
    $admin->assignRole('admin');

    $response = actingAs($admin)->get('/admin');

    $response->assertSuccessful();
});

it('prevents non-admins from accessing dashboard', function () {
    $user = User::factory()->create();

    $response = actingAs($user)->get('/admin');

    $response->assertForbidden();
});

it('redirects admins from the landing page to the admin dashboard', function () {
    $admin = User::factory()->create();

    setPermissionsTeamId(null);
    $admin->assignRole('admin');

    actingAs($admin)->get('/')->assertRedirect(route('admin.dashboard'));
});

it('shows the landing page to non-admins', function () {
    $user = User::factory()->create();

    actingAs($user)->get('/')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page->component('landing/index'));
});
