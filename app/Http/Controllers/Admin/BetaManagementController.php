<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\BetaRequestCollection;
use App\Mail\BetaInvitationMail;
use App\Models\BetaRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class BetaManagementController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display all beta requests with stats and filters.
     */
    public function index(Request $request): Response
    {
        $query = BetaRequest::query()->with(['approvedBy', 'user']);

        // Apply status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Apply email search
        if ($request->filled('search')) {
            $query->where('email', 'like', '%'.$request->search.'%');
        }

        // Order by most recent first
        $query->orderBy('created_at', 'desc');

        $betaRequests = $query->paginate(20)->withQueryString();

        // Calculate stats
        $stats = [
            'pending' => BetaRequest::query()->where('status', 'pending')->count(),
            'approved' => BetaRequest::query()->where('status', 'approved')->count(),
            'converted' => BetaRequest::query()->where('status', 'converted')->count(),
            'rejected' => BetaRequest::query()->where('status', 'rejected')->count(),
            'expired' => BetaRequest::query()->where('status', 'expired')->count(),
            'active_beta_users' => BetaRequest::query()->where('status', 'converted')
                ->whereHas('user')
                ->count(),
            'total' => BetaRequest::query()->count(),
        ];

        return Inertia::render('admin/beta-requests', [
            'betaRequests' => new BetaRequestCollection($betaRequests),
            'stats' => $stats,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    /**
     * Approve a beta request and send invitation email.
     */
    public function approve(BetaRequest $betaRequest): RedirectResponse
    {
        $this->authorize('approve', $betaRequest);

        $betaRequest->approve(Auth::user());

        // Determine locale: check if user exists, otherwise use app fallback
        $existingUser = \App\Models\User::where('email', $betaRequest->email)->first();
        $locale = $existingUser?->locale ?? config('app.fallback_locale');

        // Send invitation email in appropriate language
        Mail::to($betaRequest->email)
            ->locale($locale)
            ->queue(new BetaInvitationMail($betaRequest));

        return back()->with('success', 'Demande approuvée. Un email d\'invitation a été envoyé.');
    }

    /**
     * Reject a beta request.
     */
    public function reject(Request $request, BetaRequest $betaRequest): RedirectResponse
    {
        $this->authorize('reject', $betaRequest);

        $request->validate([
            'rejection_reason' => 'nullable|string|max:1000',
        ]);

        $betaRequest->reject($request->rejection_reason);

        return back()->with('success', 'Demande rejetée.');
    }

    /**
     * Resend invitation email for an approved request.
     */
    public function resend(BetaRequest $betaRequest): RedirectResponse
    {
        $this->authorize('resend', $betaRequest);

        if (! $betaRequest->isTokenValid()) {
            return back()->with('error', 'Le token d\'invitation a expiré. Veuillez réapprouver la demande.');
        }

        // Determine locale: check if user exists, otherwise use app fallback
        $existingUser = \App\Models\User::where('email', $betaRequest->email)->first();
        $locale = $existingUser?->locale ?? config('app.fallback_locale');

        // Resend invitation email in appropriate language
        Mail::to($betaRequest->email)
            ->locale($locale)
            ->queue(new BetaInvitationMail($betaRequest));

        return back()->with('success', 'Email d\'invitation renvoyé.');
    }

    /**
     * Cleanup ALL beta users (even non-expired ones) - DANGER.
     */
    public function cleanupAll(): RedirectResponse
    {
        $this->authorize('cleanup', BetaRequest::class);

        $expiredRequests = BetaRequest::query()
            ->where('status', 'converted')
            ->with('user')
            ->get();

        $count = 0;

        /** @var BetaRequest $betaRequest */
        foreach ($expiredRequests as $betaRequest) {
            if ($betaRequest->user) {
                $betaRequest->user->delete(); // CASCADE delete
                $count++;
            }

            $betaRequest->markAsExpired();

            Log::info('Beta user manually deleted via cleanup', [
                'email' => $betaRequest->email,
                'admin_id' => Auth::id(),
            ]);
        }

        return back()->with('success', "{$count} comptes beta supprimés avec succès.");
    }
}
