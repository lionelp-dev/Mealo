<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class LocaleController extends Controller
{
    /**
     * Update the user's locale preference.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();
        abort_unless($user instanceof User, 403);

        /** @var array{locale: string} $validated */
        $validated = $request->validate([
            'locale' => ['required', 'string', Rule::in(['en', 'fr'])],
        ]);

        $user->update([
            'locale' => $validated['locale'],
        ]);

        return back();
    }
}
