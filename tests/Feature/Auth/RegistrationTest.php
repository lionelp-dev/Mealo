<?php

use App\Jobs\RecipeAIGenerationJob;
use App\Models\MealTime;
use App\Models\User;
use Illuminate\Support\Facades\Bus;
use Inertia\Testing\AssertableInertia;

use function Tests\createRecipeFor;
use function Tests\createUserWithWorkspace;

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertStatus(200);
});

test('new users can register', function () {
    Bus::fake();

    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('registering dispatches a starter pack of AI recipe generation jobs', function () {
    Bus::fake();

    $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $user = User::query()->where('email', 'test@example.com')->firstOrFail();

    Bus::assertChained(
        array_fill(0, MealTime::query()->count(), RecipeAIGenerationJob::class),
    );

    Bus::assertDispatched(
        RecipeAIGenerationJob::class,
        fn (RecipeAIGenerationJob $job): bool => $job->userId === $user->id,
    );
});

test('registering flags the session for starter recipes without flashing a toast', function () {
    Bus::fake();

    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertSessionHas('starter_recipes_requested_at');
    $response->assertSessionMissing('message');
});

test('the shared starterRecipes prop tracks generation progress', function () {
    Bus::fake();

    $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $user = User::query()->where('email', 'test@example.com')->firstOrFail();

    // No recipe yet → still generating.
    $this->get(route('recipes.index'))
        ->assertInertia(fn (AssertableInertia $page) => $page->where('starterRecipes.generating', true));

    createRecipeFor($user);

    // First recipe landed → generation is considered done, session flag cleared.
    $this->get(route('recipes.index'))
        ->assertInertia(fn (AssertableInertia $page) => $page->where('starterRecipes.generating', false));

    // Flag forgotten → prop is null on subsequent loads.
    $this->get(route('recipes.index'))
        ->assertInertia(fn (AssertableInertia $page) => $page->where('starterRecipes', null));
});

test('the starterRecipes prop stops generating once generation is stale', function () {
    $user = createUserWithWorkspace();

    // Requested long enough ago that the job is assumed to have failed, and the
    // user still has no recipe → we must stop claiming recipes are on the way.
    $this->actingAs($user)
        ->withSession(['starter_recipes_requested_at' => now()->subMinutes(6)->toISOString()])
        ->get(route('recipes.index'))
        ->assertInertia(fn (AssertableInertia $page) => $page->where('starterRecipes', null));
});
