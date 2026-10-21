<?php

namespace Tests\Feature\Recipe;

use App\Clients\Ai\RecipeAIClient;
use App\Data\Requests\Recipe\RecipeDiscoveryRequestData;
use App\Models\MealTime;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;

describe('RecipeDiscoveryClient', function () {
    test('forwards selected meal times to the discovery API', function () {
        /** @var \Tests\TestCase $this */
        $mealTime = MealTime::query()->where('slug', 'breakfast')->firstOrFail();

        config()->set('services.ai.url', 'https://ai.test');
        config()->set('services.ai.token', 'test-token');
        Http::fake([
            'https://ai.test/internal/recipes/discover' => Http::response([
                'recipes' => [],
                'failedRecipeCount' => 0,
            ]),
        ]);
        $mealTimeCatalog = MealTime::query()
            ->orderBy('id')
            ->get(['id', 'slug'])
            ->map(fn (MealTime $mealTime): array => [
                'id' => $mealTime->id,
                'slug' => $mealTime->slug,
            ])
            ->all();

        app(RecipeAIClient::class)->discover(
            RecipeDiscoveryRequestData::validateAndCreate([
                'prompt' => 'Quelque chose de léger',
                'meal_times' => [$mealTime->slug],
            ]),
            $this->user,
        );

        Http::assertSent(function (Request $request) use ($mealTime, $mealTimeCatalog): bool {
            return $request->url() === 'https://ai.test/internal/recipes/discover'
                && $request['prompt'] === 'Quelque chose de léger'
                && $request['meal_times'] === $mealTimeCatalog
                && $request['selected_meal_times'] === [$mealTime->slug];
        });
    });
});
