<?php

use App\Actions\Demo\DemoAccountCreateAction;
use App\Models\User;
use Illuminate\Support\Facades\Bus;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;
use function Tests\createRecipeFor;
use function Tests\createUserWithWorkspace;

beforeEach(function () {
    /** @var \Tests\TestCase $this */
    setPermissionsTeamId(null);

    Permission::create(['name' => 'access-admin-panel']);
    Role::create(['name' => 'admin'])->givePermissionTo('access-admin-panel');

    $this->admin = User::factory()->create();
    setPermissionsTeamId(null);
    $this->admin->assignRole('admin');
});

it('prevents non-admins from accessing the users list', function () {
    /** @var \Tests\TestCase $this */
    $user = User::factory()->create();

    actingAs($user)->get(route('admin.users.index'))->assertForbidden();
});

it('lists users for admins', function () {
    /** @var \Tests\TestCase $this */
    User::factory()->count(3)->create();

    actingAs($this->admin)->get(route('admin.users.index'))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('admin/users')
            ->has('users.data')
            ->has('filters'));
});

it('filters users by search term', function () {
    /** @var \Tests\TestCase $this */
    User::factory()->create(['email' => 'needle@example.com']);
    User::factory()->create(['email' => 'other@example.com']);

    actingAs($this->admin)->get(route('admin.users.index', ['search' => 'needle']))
        ->assertInertia(fn ($page) => $page
            ->has('users.data', 1));
});

it('deletes a user and their recipes', function () {
    /** @var \Tests\TestCase $this */
    $victim = createUserWithWorkspace();
    $recipe = createRecipeFor($victim);

    actingAs($this->admin)->delete(route('admin.users.destroy', $victim))
        ->assertSessionHas('success');

    assertDatabaseMissing('users', ['id' => $victim->id]);
    assertDatabaseMissing('recipes', ['id' => $recipe->id]);
});

it('prevents deleting your own account', function () {
    /** @var \Tests\TestCase $this */
    actingAs($this->admin)->delete(route('admin.users.destroy', $this->admin))
        ->assertForbidden();

    assertDatabaseHas('users', ['id' => $this->admin->id]);
});

it('prevents deleting another admin', function () {
    /** @var \Tests\TestCase $this */
    $otherAdmin = User::factory()->create();
    setPermissionsTeamId(null);
    $otherAdmin->assignRole('admin');

    actingAs($this->admin)->delete(route('admin.users.destroy', $otherAdmin))
        ->assertForbidden();

    assertDatabaseHas('users', ['id' => $otherAdmin->id]);
});

it('extends a demo account expiration', function () {
    /** @var \Tests\TestCase $this */
    config()->set('demo.account_days', 30);
    Bus::fake();
    $demoUser = app(DemoAccountCreateAction::class)->execute();
    $demoUser->demoAccount()->update(['expires_at' => now()->addDay()]);

    actingAs($this->admin)->post(route('admin.users.demo.extend', $demoUser))
        ->assertSessionHas('success');

    expect($demoUser->demoAccount->fresh()->expires_at->isAfter(now()->addDays(20)))->toBeTrue();
});

it('revokes a demo account expiration', function () {
    /** @var \Tests\TestCase $this */
    Bus::fake();
    $demoUser = app(DemoAccountCreateAction::class)->execute();

    actingAs($this->admin)->post(route('admin.users.demo.revoke', $demoUser))
        ->assertSessionHas('success');

    expect($demoUser->demoAccount->fresh()->isExpired())->toBeTrue();
});

it('returns 404 when managing demo expiration on a non-demo user', function () {
    /** @var \Tests\TestCase $this */
    $user = User::factory()->create();

    actingAs($this->admin)->post(route('admin.users.demo.extend', $user))
        ->assertNotFound();
});
