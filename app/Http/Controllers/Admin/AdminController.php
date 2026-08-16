<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Recipe;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    use AuthorizesRequests;

    public function dashboard(): Response
    {
        $stats = [
            'total_users' => User::query()->count(),
            'demo_users' => User::query()->demo()->count(),
            'total_recipes' => Recipe::query()->count(),
            'total_workspaces' => Workspace::query()->count(),
            'recent_signups_week' => User::query()->where('created_at', '>=', now()->subWeek())->count(),
        ];

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
        ]);
    }
}
