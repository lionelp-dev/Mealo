<?php

namespace Tests\Integration\Actions\Admin;

use App\Actions\Admin\DemoExpirationUpdateAction;
use App\Actions\Demo\DemoAccountCreateAction;
use Illuminate\Support\Facades\Bus;

describe('DemoExpirationUpdateAction', function () {
    // Demo account creation dispatches a starter-pack recipe generation chain.
    beforeEach(fn () => Bus::fake());

    test('updates the demo account expiration date', function () {
        /** @var \Tests\TestCase $this */
        $user = app(DemoAccountCreateAction::class)->execute();
        $newExpiry = now()->addDays(60)->toImmutable();

        app(DemoExpirationUpdateAction::class)->execute($user, $newExpiry);

        expect($user->demoAccount->fresh()->expires_at->toDateString())
            ->toBe($newExpiry->toDateString());
    });
});
