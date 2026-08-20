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
        fn(RecipeAIGenerationJob $job): bool => $job->userId === $user->id,
    );
});
