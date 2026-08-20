<?php

namespace App\Http\Middleware;

use App\Actions\Recipes\RecipeGenerationSessionState;
use App\Actions\Recipes\RecipeGenerateStarterPackAction;
use App\Models\MealTime;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $quote = Inspiring::quotes()->random();
        $quote = is_string($quote) ? $quote : '';
        [$message, $author] = str($quote)->explode('-', 2)->pad(2, '');
        $message = is_string($message) ? $message : '';
        $author = is_string($author) ? $author : '';

        $user = $request->user();
        $recipeGenerationSessionState = app(RecipeGenerationSessionState::class);

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $user instanceof User ? array_merge(
                    $user->loadMissing('demoAccount')->toArray(),
                    [
                        'is_demo' => $user->demoAccount !== null,
                        'demo_expires_at' => $user->demoAccount?->expires_at?->toISOString(),
                        'demo_token' => $user->demoAccount?->token,
                        'locale' => $user->locale,
                    ]
                ) : null,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'starterRecipes' => function () use ($request, $user): ?array {
                if (! $user instanceof User) {
                    return null;
                }

                $requestedAtRaw = $request->session()->get('starter_recipes_requested_at');

                if (! is_string($requestedAtRaw)) {
                    return null;
                }

                $expectedStarterRecipesCount = MealTime::query()->count()
                    * RecipeGenerateStarterPackAction::SIGNUP_RECIPES_PER_MEAL_TIME;
                $currentRecipeCount = $user->recipes()->count();
                $remainingStarterRecipesCount = max(0, $expectedStarterRecipesCount - $currentRecipeCount);

                if ($remainingStarterRecipesCount === 0) {
                    $request->session()->forget('starter_recipes_requested_at');

                    return ['generating' => false, 'count' => 0];
                }

                // Generation is taking too long (the job likely failed): stop
                // telling the user their recipes are on the way and fall back to
                // the usual empty state instead of showing a false message forever.
                if (CarbonImmutable::parse($requestedAtRaw)->addMinutes(5)->isPast()) {
                    $request->session()->forget('starter_recipes_requested_at');

                    return null;
                }

                return ['generating' => true, 'count' => $remainingStarterRecipesCount];
            },
            'recipeGeneration' => fn (): ?array => $recipeGenerationSessionState->toInertiaProp(
                $request,
                $user instanceof User ? $user : null,
            ),
            'generated_image_data_url' => fn () => $request->session()->get('generated_image_data_url'),
            'show_recipe_ai_generation_modal' => fn () => $request->session()->get('show_recipe_ai_generation_modal'),
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
                'new_workspace_id' => fn () => $request->session()->get('new_workspace_id'),
            ],
        ];
    }
}
