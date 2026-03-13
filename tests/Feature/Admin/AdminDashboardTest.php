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
    $response->assertInertia(fn ($page) => $page
        ->component('admin/dashboard')
        ->has('stats'));
});

it('prevents non-admins from accessing dashboard', function () {
    $user = User::factory()->create();

    $response = actingAs($user)->get('/admin');

    $response->assertForbidden();
});

it('returns correct stats on dashboard', function () {
    $recipeOwner = User::factory()->create();
    User::factory()->count(10)->create();
    BetaRequest::factory()->pending()->count(3)->create();
    Recipe::factory()->count(5)->for($recipeOwner)->create();

    $admin = User::factory()->create();

    // Set team ID to null before assigning global role
    setPermissionsTeamId(null);
    $admin->assignRole('admin');

    $response = actingAs($admin)->get('/admin');

    $response->assertInertia(fn ($page) => $page
        ->component('admin/dashboard')
        ->where('stats.total_users', 12) // 10 + recipeOwner + admin
        ->where('stats.pending_beta_requests', 3)
        ->where('stats.total_recipes', 5));
});

it('counts beta users correctly', function () {
    // Create regular users
    User::factory()->count(5)->create();

    // Create approver user (will be used as approved_by)
    $approver = User::factory()->create();

    // Create beta users (converted status)
    $betaUsers = User::factory()->count(3)->create();
    foreach ($betaUsers as $user) {
        BetaRequest::factory()->converted()->create([
            'user_id' => $user->id,
            'approved_by' => $approver->id, // Reuse same approver to avoid creating extra users
        ]);
    }

    $admin = User::factory()->create();

    // Set team ID to null before assigning global role
    setPermissionsTeamId(null);
    $admin->assignRole('admin');

    $response = actingAs($admin)->get('/admin');

    $response->assertInertia(fn ($page) => $page
        ->where('stats.beta_users', 3)
        ->where('stats.total_users', 10)); // 5 regular + 3 beta + 1 approver + 1 admin
});

it('counts recent signups correctly', function () {
    // Create old users
    User::factory()->count(5)->create(['created_at' => now()->subWeeks(2)]);

    // Create recent users (within last week)
    User::factory()->count(3)->create(['created_at' => now()->subDays(3)]);

    // Create admin with old timestamp to not be counted in recent signups
    $admin = User::factory()->create(['created_at' => now()->subWeeks(3)]);

    // Set team ID to null before assigning global role
    setPermissionsTeamId(null);
    $admin->assignRole('admin');

    $response = actingAs($admin)->get('/admin');

    $response->assertInertia(fn ($page) => $page
        ->where('stats.recent_signups_week', 3));
});
