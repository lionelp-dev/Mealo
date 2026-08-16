<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Admin\DemoExpirationUpdateAction;
use App\Actions\Admin\UserDeleteAction;
use App\Data\Resources\Admin\UserResource;
use App\Http\Controllers\Concerns\HasAuthenticatedUser;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserManagementController extends Controller
{
    use HasAuthenticatedUser;

    public function index(Request $request): Response
    {
        $search = trim((string) $request->string('search'));

        $users = User::query()
            ->with('demoAccount')
            ->withCount(['recipes', 'workspaces'])
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($q) use ($search): void {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('created_at')
            ->paginate(50)
            ->withQueryString();

        return Inertia::render('admin/users', [
            'users' => UserResource::collect($users),
            'filters' => ['search' => $search],
        ]);
    }

    public function destroy(User $user, UserDeleteAction $deleteUser): RedirectResponse
    {
        abort_if($user->is($this->authenticatedUser()), 403, 'You cannot delete your own account.');
        abort_if($user->isAdmin(), 403, 'You cannot delete another admin.');

        $deleteUser->execute($user);

        return back()->with('success', 'User deleted.');
    }

    public function extendDemo(User $user, DemoExpirationUpdateAction $updateExpiration): RedirectResponse
    {
        abort_unless($user->isDemo(), 404);

        $accountDays = config('demo.account_days', 30);
        $accountDays = is_numeric($accountDays) ? (int) $accountDays : 30;

        $updateExpiration->execute($user, now()->addDays($accountDays)->toImmutable());

        return back()->with('success', 'Demo account extended.');
    }

    public function revokeDemo(User $user, DemoExpirationUpdateAction $updateExpiration): RedirectResponse
    {
        abort_unless($user->isDemo(), 404);

        $updateExpiration->execute($user, now()->toImmutable());

        return back()->with('success', 'Demo account revoked.');
    }
}
