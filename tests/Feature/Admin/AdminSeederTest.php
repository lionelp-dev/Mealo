<?php

use App\Models\User;
use Database\Seeders\AdminSeeder;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Hash;

it('skips admin seeding when admin password is null', function () {
    config()->set('app.admin_password', null);

    $this->seed(AdminSeeder::class);

    $this->assertDatabaseMissing('users', [
        'email' => 'admin@mail.com',
    ]);
});

it('creates an admin when admin password is configured', function () {
    Bus::fake();

    config()->set('app.admin_password', 'secret-password');

    $this->seed(AdminSeeder::class);

    $admin = User::query()
        ->where('email', 'admin@mail.com')
        ->firstOrFail();

    expect($admin->name)->toBe('admin');
    expect(Hash::check('secret-password', $admin->password))->toBeTrue();
    expect($admin->isAdmin())->toBeTrue();

    $this->assertDatabaseHas('permissions', [
        'name' => 'access-admin-panel',
    ]);
});
