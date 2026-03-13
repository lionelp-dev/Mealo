<?php

use App\Models\User;

use function Pest\Laravel\actingAs;

it('allows navigation between admin pages', function () {
    $admin = User::factory()->create();
    $admin->givePermissionTo('access-admin-panel');

    $page = visit('/admin', actingAs($admin));

    $page->assertSee('Admin Dashboard')
        ->assertSee('Beta Requests')
        ->click('Beta Requests')
        ->assertUrl('/admin/beta-requests')
        ->assertSee('Gestion Beta')
        ->assertNoJavascriptErrors();
});

it('shows admin panel indicator in sidebar', function () {
    $admin = User::factory()->create();
    $admin->givePermissionTo('access-admin-panel');

    $page = visit('/admin', actingAs($admin));

    $page->assertSee('Admin Panel')
        ->assertNoJavascriptErrors();
});

it('allows navigation back to dashboard via breadcrumbs', function () {
    $admin = User::factory()->create();
    $admin->givePermissionTo('access-admin-panel');

    $page = visit('/admin/beta-requests', actingAs($admin));

    $page->assertSee('Admin')
        ->assertSee('Beta Requests')
        ->click('Admin')
        ->assertUrl('/admin')
        ->assertSee('Admin Dashboard')
        ->assertNoJavascriptErrors();
});

it('displays all stats on dashboard', function () {
    $admin = User::factory()->create();
    $admin->givePermissionTo('access-admin-panel');

    $page = visit('/admin', actingAs($admin));

    $page->assertSee('Total Users')
        ->assertSee('Beta Users')
        ->assertSee('Pending Beta Requests')
        ->assertSee('Total Recipes')
        ->assertSee('Total Workspaces')
        ->assertSee('New Signups')
        ->assertNoJavascriptErrors();
});

it('allows clicking on pending beta requests to navigate', function () {
    $admin = User::factory()->create();
    $admin->givePermissionTo('access-admin-panel');

    $page = visit('/admin', actingAs($admin));

    $page->click('Pending Beta Requests')
        ->assertUrl('/admin/beta-requests')
        ->assertNoJavascriptErrors();
});
