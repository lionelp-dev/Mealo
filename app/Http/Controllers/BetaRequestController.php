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
        $betaRequest = BetaRequest::query()->create([
            'email' => $request->validated('email'),
            'status' => 'pending',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        // Detect user's preferred language from browser
        $locale = $request->getPreferredLanguage(['fr', 'en']) ?? config('app.fallback_locale');

        // Send confirmation email in user's language (queued)
        Mail::to($betaRequest->email)
            ->locale($locale)
            ->queue(new BetaRequestConfirmationMail($betaRequest));

        return back()->with('success', 'Merci ! Votre demande d\'accès a bien été enregistrée. Vous recevrez un email si votre demande est approuvée.');
    }
}
