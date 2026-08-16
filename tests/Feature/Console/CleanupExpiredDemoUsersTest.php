<?php

namespace Tests\Feature\Console;

use App\Models\User;
use Illuminate\Support\Str;

use function Pest\Laravel\artisan;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;
use function Tests\createRecipeFor;

function makeDemoUserWithExpiry(\DateTimeInterface $expiresAt): User
{
    $user = User::factory()->create();

    $user->demoAccount()->create([
        'token' => (string) Str::uuid(),
        'expires_at' => $expiresAt,
    ]);

    return $user;
}

describe('demo:cleanup-expired', function () {
    test('deletes expired demo users, keeps active demo and normal users', function () {
        /** @var \Tests\TestCase $this */
        $expired = makeDemoUserWithExpiry(now()->subDay());
        $active = makeDemoUserWithExpiry(now()->addDays(10));
        $normal = User::factory()->create();

        artisan('demo:cleanup-expired')->assertSuccessful();

        assertDatabaseMissing('users', ['id' => $expired->id]);
        assertDatabaseMissing('demo_accounts', ['user_id' => $expired->id]);
        assertDatabaseHas('users', ['id' => $active->id]);
        assertDatabaseHas('users', ['id' => $normal->id]);
    });

    test('deletes an expired demo user together with its recipes', function () {
        /** @var \Tests\TestCase $this */
        $expired = makeDemoUserWithExpiry(now()->subDay());

        $recipe = createRecipeFor($expired);

        artisan('demo:cleanup-expired')->assertSuccessful();

        assertDatabaseMissing('users', ['id' => $expired->id]);
        assertDatabaseMissing('recipes', ['id' => $recipe->id]);
    });

    test('does nothing when there are no expired demo users', function () {
        /** @var \Tests\TestCase $this */
        artisan('demo:cleanup-expired')
            ->expectsOutputToContain('No expired demo users found.')
            ->assertSuccessful();
    });
});
