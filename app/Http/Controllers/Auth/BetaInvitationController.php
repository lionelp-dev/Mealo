<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\SetPasswordFromBetaRequest;
use App\Models\BetaRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class BetaInvitationController extends Controller
{
    /**
     * Show the password setup page for a valid beta invitation token.
     */
    public function show(string $token): Response|RedirectResponse
    {
        $betaRequest = BetaRequest::findByToken($token);

        // Validate token exists, is approved, hasn't been used, and hasn't expired
        if (! $betaRequest
            || $betaRequest->status !== 'approved'
            || $betaRequest->user_id !== null
            || $betaRequest->isTokenExpired()) {
            return redirect()->route('home')->with('error', 'Lien d\'invitation invalide ou expiré.');
        }

        return Inertia::render('auth/beta-set-password', [
            'token' => $token,
            'email' => $betaRequest->email,
            'expiresAt' => $betaRequest->token_expires_at->toISOString(),
        ]);
    }

    /**
     * Create user account from beta invitation and activate it.
     */
    public function accept(string $token, SetPasswordFromBetaRequest $request): RedirectResponse
    {
        $betaRequest = BetaRequest::findByToken($token);

        // Validate token (same checks as show method)
        if (! $betaRequest
            || $betaRequest->status !== 'approved'
            || $betaRequest->user_id !== null
            || $betaRequest->isTokenExpired()) {
            return redirect()->route('home')->with('error', 'Lien d\'invitation invalide ou expiré.');
        }

        // Create user
        $user = User::create([
            'name' => $request->name,
            'email' => $betaRequest->email,
            'password' => Hash::make($request->password),
        ]);

        // Mark email as verified (not mass assignable, so set separately)
        $user->email_verified_at = now();
        $user->save();

        // Note: User::booted() hook automatically creates personal workspace

        // Mark beta request as converted and set account expiration
        $betaRequest->markAsConverted($user);

        // Authenticate the user automatically
        Auth::login($user);

        return redirect()->route('dashboard')->with('success', 'Bienvenue ! Votre compte beta a été activé avec succès.');
    }
}
