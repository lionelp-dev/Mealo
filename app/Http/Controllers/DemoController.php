<?php

namespace App\Http\Controllers;

use App\Actions\Demo\DemoAccountCreateAction;
use App\Models\DemoAccount;
use App\Models\DemoInvite;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DemoController extends Controller
{
    /**
     * Create an isolated demo account from the public share link.
     */
    public function enter(string $token, DemoAccountCreateAction $createDemoAccount): RedirectResponse
    {
        abort_unless((bool) config('demo.enabled', true), 404);

        $user = DB::transaction(function () use ($token, $createDemoAccount): User {
            $invite = DemoInvite::query()
                ->where('token', $token)
                ->lockForUpdate()
                ->first();

            abort_if($invite === null || ! $invite->isUsable(), 404);

            $user = $createDemoAccount->execute($invite);
            $invite->incrementUsage();

            return $user;
        });

        Auth::login($user);

        return to_route('dashboard');
    }

    /**
     * Reconnect to an existing demo account via its personal demo token.
     */
    public function reconnect(string $demoToken): RedirectResponse
    {
        $demoAccount = DemoAccount::query()->where('token', $demoToken)->with('user')->first();

        abort_if($demoAccount === null || $demoAccount->isExpired() || $demoAccount->user === null, 404);

        Auth::login($demoAccount->user);

        return to_route('dashboard');
    }
}
