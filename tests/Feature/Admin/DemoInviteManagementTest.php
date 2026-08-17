<?php

use App\Actions\Demo\DemoAccountCreateAction;
use App\Models\DemoInvite;
use App\Models\User;
use Illuminate\Support\Facades\Bus;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;

beforeEach(function () {
    /** @var \Tests\TestCase $this */
    setPermissionsTeamId(null);

    Permission::create(['name' => 'access-admin-panel']);
    Role::create(['name' => 'admin'])->givePermissionTo('access-admin-panel');

    $this->admin = User::factory()->create();
    setPermissionsTeamId(null);
    $this->admin->assignRole('admin');
});

it('prevents non-admins from accessing demo links', function () {
    /** @var \Tests\TestCase $this */
    $user = User::factory()->create();

    actingAs($user)->get(route('admin.demo-invites.index'))->assertForbidden();
});

it('lists demo links for admins', function () {
    /** @var \Tests\TestCase $this */
    DemoInvite::create([
        'token' => 'sample-token',
        'label' => 'CV link',
        'max_uses' => 10,
        'is_active' => true,
    ]);

    actingAs($this->admin)->get(route('admin.demo-invites.index'))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('admin/demo-invites')
            ->has('demoInvites', 1));
});

it('creates a demo link with a generated token', function () {
    /** @var \Tests\TestCase $this */
    actingAs($this->admin)->post(route('admin.demo-invites.store'), [
        'label' => 'New link',
        'max_uses' => 25,
        'expires_at' => null,
        'is_active' => true,
    ])->assertSessionHas('success');

    assertDatabaseHas('demo_invites', [
        'label' => 'New link',
        'max_uses' => 25,
        'is_active' => true,
    ]);

    expect(DemoInvite::first()->token)->not->toBeEmpty();
});

it('validates that max_uses is at least 1', function () {
    /** @var \Tests\TestCase $this */
    actingAs($this->admin)->post(route('admin.demo-invites.store'), [
        'label' => 'Bad',
        'max_uses' => 0,
        'expires_at' => null,
        'is_active' => true,
    ])->assertSessionHasErrors('max_uses');
});

it('updates a demo link', function () {
    /** @var \Tests\TestCase $this */
    $invite = DemoInvite::create([
        'token' => 'tok',
        'label' => 'Old',
        'max_uses' => 5,
        'is_active' => true,
    ]);

    actingAs($this->admin)->put(route('admin.demo-invites.update', $invite), [
        'label' => 'Updated',
        'max_uses' => 99,
        'expires_at' => null,
        'is_active' => false,
    ])->assertSessionHas('success');

    assertDatabaseHas('demo_invites', [
        'id' => $invite->id,
        'label' => 'Updated',
        'max_uses' => 99,
        'is_active' => false,
    ]);
});

it('toggles the active state of a demo link', function () {
    /** @var \Tests\TestCase $this */
    $invite = DemoInvite::create([
        'token' => 'tok',
        'max_uses' => 5,
        'is_active' => true,
    ]);

    actingAs($this->admin)->post(route('admin.demo-invites.toggle', $invite))
        ->assertSessionHas('success');

    expect($invite->fresh()->is_active)->toBeFalse();
});

it('deletes a demo link but keeps its demo accounts', function () {
    /** @var \Tests\TestCase $this */
    $invite = DemoInvite::create([
        'token' => 'tok',
        'max_uses' => 5,
        'is_active' => true,
    ]);
    Bus::fake();
    $demoUser = app(DemoAccountCreateAction::class)->execute($invite);

    actingAs($this->admin)->delete(route('admin.demo-invites.destroy', $invite))
        ->assertSessionHas('success');

    assertDatabaseMissing('demo_invites', ['id' => $invite->id]);
    assertDatabaseHas('demo_accounts', [
        'user_id' => $demoUser->id,
        'demo_invite_id' => null,
    ]);
});
