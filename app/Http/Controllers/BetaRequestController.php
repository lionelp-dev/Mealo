<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBetaRequestRequest;
use App\Mail\BetaRequestConfirmationMail;
use App\Models\BetaRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;

class BetaRequestController extends Controller
{
    public function store(StoreBetaRequestRequest $request): RedirectResponse
    {
        /** @var array{email: string} $validated */
        $validated = $request->validated();

        $betaRequest = BetaRequest::query()->create([
            'email' => $validated['email'],
            'status' => 'pending',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        // Detect user's preferred language from browser
        $fallbackLocale = config('app.fallback_locale');
        $locale = $request->getPreferredLanguage(['fr', 'en']) ?? (is_string($fallbackLocale) ? $fallbackLocale : 'fr');

        // Send confirmation email in user's language (queued)
        Mail::to($betaRequest->email)
            ->locale($locale)
            ->queue(new BetaRequestConfirmationMail($betaRequest));

        return back()->with('success', 'Merci ! Votre demande d\'accès a bien été enregistrée. Vous recevrez un email si votre demande est approuvée.');
    }
}
