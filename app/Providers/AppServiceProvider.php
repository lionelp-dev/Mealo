<?php

namespace App\Providers;

use App\Listeners\GenerateStarterRecipesForNewUser;
use App\Models\Recipe;
use App\Models\User;
use App\Policies\RecipePolicy;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Recipe::class, RecipePolicy::class);

        // Admin panel access is app-wide and not scoped to a workspace, so it is
        // resolved via the team-agnostic User::isAdmin() rather than a
        // team-scoped Spatie permission check.
        Gate::define('access-admin-panel', fn (User $user): bool => $user->isAdmin());

        // Seed a brand-new (self-registered) account with a starter pack of
        // AI-generated recipes so meal-plan generation works from day one.
        Event::listen(Registered::class, GenerateStarterRecipesForNewUser::class);
    }
}
