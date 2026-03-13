<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class LocaleController extends Controller
{
    /**
     * Update the user's locale preference.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'locale' => ['required', 'string', Rule::in(['en', 'fr'])],
        ]);

        $request->user()->update([
            'locale' => $validated['locale'],
        ]);

        return back();
    }
}
