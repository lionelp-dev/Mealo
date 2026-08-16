<?php

namespace App\Http\Controllers\Admin;

use App\Data\Requests\Admin\DemoInviteStoreRequestData;
use App\Data\Requests\Admin\DemoInviteUpdateRequestData;
use App\Data\Resources\Admin\DemoInviteResource;
use App\Http\Controllers\Controller;
use App\Models\DemoInvite;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DemoInviteController extends Controller
{
    public function index(): Response
    {
        $invites = DemoInvite::query()
            ->with(['demoAccounts.user'])
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('admin/demo-invites', [
            'demoInvites' => DemoInviteResource::collect($invites),
        ]);
    }

    public function store(DemoInviteStoreRequestData $data): RedirectResponse
    {
        DemoInvite::query()->create([
            'token' => (string) Str::uuid(),
            'label' => $data->label,
            'max_uses' => $data->max_uses,
            'expires_at' => $data->expires_at,
            'is_active' => $data->is_active,
        ]);

        return back()->with('success', 'Demo link created.');
    }

    public function update(DemoInvite $demoInvite, DemoInviteUpdateRequestData $data): RedirectResponse
    {
        $demoInvite->update([
            'label' => $data->label,
            'max_uses' => $data->max_uses,
            'expires_at' => $data->expires_at,
            'is_active' => $data->is_active,
        ]);

        return back()->with('success', 'Demo link updated.');
    }

    public function toggle(DemoInvite $demoInvite): RedirectResponse
    {
        $demoInvite->update(['is_active' => ! $demoInvite->is_active]);

        return back()->with('success', 'Demo link updated.');
    }

    public function destroy(DemoInvite $demoInvite): RedirectResponse
    {
        $demoInvite->delete();

        return back()->with('success', 'Demo link deleted.');
    }
}
