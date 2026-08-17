<?php

namespace Tests\Integration\Actions\Recipes;

use App\Actions\Recipes\RecipeGenerateStarterPackAction;
use App\Jobs\RecipeAIGenerationJob;
use App\Models\MealTime;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;

use function Tests\createUserWithWorkspace;

describe('RecipeGenerateStarterPackAction', function () {
    beforeEach(fn () => Bus::fake());

    test('dispatches one chained AI recipe generation job per meal time', function () {
        /** @var \Tests\TestCase $this */
        $user = createUserWithWorkspace();

        app(RecipeGenerateStarterPackAction::class)->execute($user);

        Bus::assertChained(
            array_fill(0, MealTime::query()->count(), RecipeAIGenerationJob::class),
        );

        Bus::assertDispatched(
            RecipeAIGenerationJob::class,
            fn (RecipeAIGenerationJob $job): bool => $job->userId === $user->id,
        );
    });

    test('does nothing when no meal times exist', function () {
        /** @var \Tests\TestCase $this */
        // Remove pivot references first — recipe_meal_time restricts meal-time deletion.
        DB::table('recipe_meal_time')->delete();
        MealTime::query()->delete();

        app(RecipeGenerateStarterPackAction::class)->execute(createUserWithWorkspace());

        Bus::assertNothingDispatched();
    });
});
