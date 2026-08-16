<?php

namespace Tests\Feature\Demo;

use App\Models\DemoInvite;
use App\Models\User;

use function Pest\Laravel\get;

function makeInvite(array $attributes = []): DemoInvite
{
    return DemoInvite::create(array_merge([
        'token' => 'share-token',
        'max_uses' => 5,
        'used_count' => 0,
        'is_active' => true,
    ], $attributes));
}

describe('Demo entry via share link', function () {
    test('creates a demo account, logs in, redirects to dashboard and increments usage', function () {
        /** @var \Tests\TestCase $this */
        $invite = makeInvite();

        $response = get(route('demo.enter', ['token' => $invite->token]));

        $response->assertRedirect(route('dashboard'));

        $this->assertAuthenticated();

        $user = User::query()->demo()->firstOrFail();
        expect($user->demoAccount)->not->toBeNull()
            ->and($user->demoAccount->token)->not->toBeNull();
        $this->assertAuthenticatedAs($user);

        expect($invite->fresh()->used_count)->toBe(1);
    });

    test('returns 404 for an unknown token', function () {
        /** @var \Tests\TestCase $this */
        get(route('demo.enter', ['token' => 'does-not-exist']))->assertNotFound();

        $this->assertGuest();
        expect(User::query()->demo()->count())->toBe(0);
    });

    test('returns 404 when demo is disabled', function () {
        /** @var \Tests\TestCase $this */
        config()->set('demo.enabled', false);
        $invite = makeInvite();

        get(route('demo.enter', ['token' => $invite->token]))->assertNotFound();

        expect($invite->fresh()->used_count)->toBe(0);
    });

    test('returns 404 for an inactive invite', function () {
        /** @var \Tests\TestCase $this */
        $invite = makeInvite(['is_active' => false]);

        get(route('demo.enter', ['token' => $invite->token]))->assertNotFound();
    });

    test('returns 404 for an expired invite', function () {
        /** @var \Tests\TestCase $this */
        $invite = makeInvite(['expires_at' => now()->subDay()]);

        get(route('demo.enter', ['token' => $invite->token]))->assertNotFound();
    });

    test('returns 404 when max uses is reached', function () {
        /** @var \Tests\TestCase $this */
        $invite = makeInvite(['max_uses' => 2, 'used_count' => 2]);

        get(route('demo.enter', ['token' => $invite->token]))->assertNotFound();

        expect(User::query()->demo()->count())->toBe(0);
    });

    test('two visits create two distinct demo accounts', function () {
        /** @var \Tests\TestCase $this */
        $invite = makeInvite(['max_uses' => 5]);

        get(route('demo.enter', ['token' => $invite->token]));
        // Log out the first demo session before the second visit.
        auth()->logout();
        get(route('demo.enter', ['token' => $invite->token]));

        $demoUsers = User::query()->demo()->with('demoAccount')->get();
        expect($demoUsers)->toHaveCount(2)
            ->and($demoUsers[0]->demoAccount->token)->not->toBe($demoUsers[1]->demoAccount->token);

        expect($invite->fresh()->used_count)->toBe(2);
    });
});
