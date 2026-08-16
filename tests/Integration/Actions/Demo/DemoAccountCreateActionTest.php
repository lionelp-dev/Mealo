<?php

namespace Tests\Integration\Actions\Demo;

use App\Actions\Demo\DemoAccountCreateAction;

use function Pest\Laravel\assertDatabaseHas;

describe('DemoAccountCreateAction', function () {
    test('creates an isolated, expiring demo account with a personal workspace', function () {
        /** @var \Tests\TestCase $this */
        config()->set('demo.account_days', 30);

        $user = app(DemoAccountCreateAction::class)->execute();

        expect($user->isDemo())->toBeTrue()
            ->and($user->demoAccount)->not->toBeNull()
            ->and($user->demoAccount->token)->not->toBeNull()
            ->and($user->demoAccount->expires_at->isFuture())->toBeTrue()
            ->and($user->email)->toContain('@demo.local')
            ->and($user->recipes()->count())->toBe(0);

        assertDatabaseHas('demo_accounts', [
            'user_id' => $user->id,
        ]);

        expect($user->defaultWorkspace())->not->toBeNull();
    });

    test('creates distinct accounts on each call', function () {
        /** @var \Tests\TestCase $this */
        $first = app(DemoAccountCreateAction::class)->execute();
        $second = app(DemoAccountCreateAction::class)->execute();

        expect($first->id)->not->toBe($second->id)
            ->and($first->demoAccount->token)->not->toBe($second->demoAccount->token)
            ->and($first->email)->not->toBe($second->email);
    });
});
