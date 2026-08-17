<?php

namespace App\Http\Controllers;

use App\Actions\Demo\DemoAccountCreateAction;
use App\Models\DemoAccount;
use App\Models\DemoInvite;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Cookie as SymfonyCookie;

class DemoController extends Controller
{
    /**
     * Persistent cookie remembering the browser's demo account so revisiting
     * the share link reconnects to it instead of creating a new account.
     */
    public const SESSION_COOKIE = 'demo_session';

    /**
     * Create an isolated demo account from the public share link.
     *
     * If the browser already owns a still-valid demo account (tracked via the
     * persistent demo_session cookie), reconnect to it transparently instead of
     * creating a new account and consuming another invite use.
     */
    public function enter(string $token, Request $request, DemoAccountCreateAction $createDemoAccount): RedirectResponse
    {
        abort_unless((bool) config('demo.enabled', true), 404);

        $cookie = $request->cookie(self::SESSION_COOKIE);
        $existing = $this->resolveValidDemoAccount(is_string($cookie) ? $cookie : null);

        if ($existing !== null) {
            return $this->loginAndRedirect($existing);
        }

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

        // Flag the freshly-triggered starter pack so the UI can tell the demo
        // user their recipes are being generated (session-scoped).
        session()->put('starter_recipes_requested_at', now()->toISOString());

        return to_route('dashboard')->withCookie($this->demoCookie($user->demoAccount()->firstOrFail()->token));
    }

    /**
     * Reconnect to an existing demo account via its personal demo token.
     */
    public function reconnect(string $demoToken): RedirectResponse
    {
        $demoAccount = $this->resolveValidDemoAccount($demoToken);

        abort_if($demoAccount === null, 404);

        return $this->loginAndRedirect($demoAccount);
    }

    /**
     * Resolve a usable demo account from its token: it must exist, be
     * unexpired and still have an attached user.
     */
    private function resolveValidDemoAccount(?string $token): ?DemoAccount
    {
        if ($token === null || $token === '') {
            return null;
        }

        $demoAccount = DemoAccount::query()->where('token', $token)->with('user')->first();

        if ($demoAccount === null || $demoAccount->isExpired() || $demoAccount->user === null) {
            return null;
        }

        return $demoAccount;
    }

    /**
     * Log the demo user in and redirect to the dashboard, refreshing the
     * persistent demo_session cookie.
     */
    private function loginAndRedirect(DemoAccount $demoAccount): RedirectResponse
    {
        $user = $demoAccount->user;

        abort_if($user === null, 404);

        Auth::login($user);

        return to_route('dashboard')->withCookie($this->demoCookie($demoAccount->token));
    }

    /**
     * Build the persistent, unencrypted demo_session cookie carrying the
     * account's (already public) demo token.
     */
    private function demoCookie(string $token): SymfonyCookie
    {
        $accountDays = config('demo.account_days', 30);
        $accountDays = is_numeric($accountDays) ? (int) $accountDays : 30;

        return Cookie::make(self::SESSION_COOKIE, $token, minutes: $accountDays * 24 * 60);
    }
}
