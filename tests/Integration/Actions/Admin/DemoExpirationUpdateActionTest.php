<?php

namespace Tests\Integration\Actions\Admin;

use App\Actions\Admin\DemoExpirationUpdateAction;
use App\Actions\Demo\DemoAccountCreateAction;

describe('DemoExpirationUpdateAction', function () {
    test('updates the demo account expiration date', function () {
        /** @var \Tests\TestCase $this */
        $user = app(DemoAccountCreateAction::class)->execute();
        $newExpiry = now()->addDays(60)->toImmutable();

        app(DemoExpirationUpdateAction::class)->execute($user, $newExpiry);

        expect($user->demoAccount->fresh()->expires_at->toDateString())
            ->toBe($newExpiry->toDateString());
    });
});
