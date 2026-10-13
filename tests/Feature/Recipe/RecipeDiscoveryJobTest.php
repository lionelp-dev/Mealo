<?php

namespace Tests\Feature\Recipe;

use App\Actions\Recipes\RecipeDiscoveryJobState;
use App\Jobs\RecipeDiscoveryJob;
use App\Models\User;
use Illuminate\Support\Facades\Queue;
use Inertia\Testing\AssertableInertia as Assert;

describe('RecipeDiscoveryJob', function () {
    beforeEach(fn () => Queue::fake());

    test('queues recipe discovery and immediately returns a job identifier', function () {
        /** @var \Tests\TestCase $this */
        $this->actingAs($this->user)
            ->post(route('recipes.discover.pool'), [
                'prompt' => 'Un dîner végétarien rapide',
            ])
            ->assertInertia(fn (Assert $page) => $page
                ->component('recipe/index')
                ->where('discovery_job.status', 'queued')
                ->where('discovery_job.id', fn ($id): bool => is_string($id) && $id !== '')
            );

        Queue::assertPushed(
            RecipeDiscoveryJob::class,
            fn (RecipeDiscoveryJob $job): bool => $job->userId === $this->user->id
                && $job->recipeDiscoveryRequestData->prompt === 'Un dîner végétarien rapide'
                && $job->queue === RecipeDiscoveryJob::QUEUE
        );
    });

    test('returns a queued discovery status only to its owner', function () {
        /** @var \Tests\TestCase $this */
        $state = app(RecipeDiscoveryJobState::class);
        $discoveryId = $state->queue($this->user->id);
        $otherUser = User::factory()->create();

        $this->actingAs($this->user)
            ->getJson(route('recipes.discover.status', $discoveryId))
            ->assertOk()
            ->assertExactJson(['status' => 'queued']);

        $this->actingAs($otherUser)
            ->getJson(route('recipes.discover.status', $discoveryId))
            ->assertNotFound();
    });

    test('stores the completed discovery pool for polling', function () {
        /** @var \Tests\TestCase $this */
        $state = app(RecipeDiscoveryJobState::class);
        $discoveryId = $state->queue($this->user->id);
        $pool = [
            'recipes' => [],
            'failedRecipeCount' => 10,
        ];

        $state->complete($discoveryId, $this->user->id, $pool);

        expect($state->forUser($discoveryId, $this->user->id))->toBe([
            'status' => 'completed',
            'pool' => $pool,
        ]);
    });
});
