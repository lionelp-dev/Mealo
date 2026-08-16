<?php

namespace Tests\Feature\Demo;

use App\Models\User;
use Illuminate\Support\Str;

use function Pest\Laravel\get;

function makeDemoUser(array $demoAccountAttributes = []): User
{
    $user = User::factory()->create();

    $user->demoAccount()->create(array_merge([
        'token' => (string) Str::uuid(),
        'expires_at' => now()->addDays(30),
    ], $demoAccountAttributes));

    return $user->load('demoAccount');
}

describe('Demo reconnect via personal demo token', function () {
    test('reconnects to the same account and redirects to dashboard', function () {
        /** @var \Tests\TestCase $this */
        $user = makeDemoUser();

        $response = get(route('demo.reconnect', ['demoToken' => $user->demoAccount->token]));

        $response->assertRedirect(route('dashboard'));
        $this->assertAuthenticatedAs($user);
    });

    test('returns 404 for an unknown demo token', function () {
        /** @var \Tests\TestCase $this */
        get(route('demo.reconnect', ['demoToken' => 'unknown']))->assertNotFound();
        $this->assertGuest();
    });

    test('returns 404 for an expired demo account', function () {
        /** @var \Tests\TestCase $this */
        $user = makeDemoUser(['expires_at' => now()->subDay()]);

        get(route('demo.reconnect', ['demoToken' => $user->demoAccount->token]))->assertNotFound();
        $this->assertGuest();
    });

    test('returns 404 when the token belongs to a non-demo user', function () {
        /** @var \Tests\TestCase $this */
        $user = User::factory()->create();

        get(route('demo.reconnect', ['demoToken' => 'whatever']))->assertNotFound();

        expect($user->fresh())->not->toBeNull()
            ->and($user->isDemo())->toBeFalse();
    });
});
