<?php

namespace Tests\Integration\Actions\PlannedMeal;

use App\Actions\PlannedMeal\PlannedMealGeneratePlanAction;
use App\Data\Requests\PlannedMeal\PlannedMealGeneratePlanRequestData;
use App\Models\PlannedMeal;
use InvalidArgumentException;

describe('PlannedMealGeneratePlanAction', function () {
    test('selects the combination with the fewest global ingredients', function () {
        /** @var \Tests\TestCase $this */
        $action = app(PlannedMealGeneratePlanAction::class);
        $selectPlans = new \ReflectionMethod($action, 'selectMealPlansWithFewestGlobalIngredients');
        $selectPlans->setAccessible(true);

        $recipe = fn (string $id, array $ingredientIds): array => [
            'id' => $id,
            'name' => $id,
            'mealTimeIds' => [],
            'ingredients' => array_map(
                fn (int $ingredientId): array => ['id' => $ingredientId],
                $ingredientIds,
            ),
        ];

        $selectedPlans = $selectPlans->invoke($action, [
            1 => [
                [
                    $recipe('breakfast-local', [1, 2]),
                ],
                [
                    $recipe('breakfast-global', [3, 4, 5]),
                ],
            ],
            2 => [
                [
                    $recipe('lunch-global', [3, 4, 5]),
                ],
                [
                    $recipe('lunch-local', [6, 7]),
                ],
            ],
        ]);

        expect($selectedPlans[1][0]['id'])->toBe('breakfast-global')
            ->and($selectedPlans[2][0]['id'])->toBe('lunch-global');
    });

    test('successfully generates a meal plan', function () {
        /** @var \Tests\TestCase $this */
        $this->setUpRecipeContext();

        $createdCount = app(PlannedMealGeneratePlanAction::class)->execute(
            $this->user,
            $this->user->defaultWorkspace(),
            new PlannedMealGeneratePlanRequestData(
                startDate: '2026-09-01',
                endDate: '2026-09-03',
                serving_size: 2,
            ),
        );

        expect($createdCount)->toBeGreaterThan(0);

        $dates = PlannedMeal::query()
            ->where('user_id', $this->user->id)
            ->where('workspace_id', $this->user->defaultWorkspace()->id)
            ->pluck('planned_date')
            ->map(fn ($date) => $date->toDateString())
            ->unique()
            ->sort()
            ->values()
            ->all();

        expect($dates)->toBe([
            '2026-09-01',
            '2026-09-02',
            '2026-09-03',
        ]);
    });

    test('generates the full range when it is longer than the default distribution', function () {
        /** @var \Tests\TestCase $this */
        $this->setUpRecipeContext();

        app(PlannedMealGeneratePlanAction::class)->execute(
            $this->user,
            $this->user->defaultWorkspace(),
            new PlannedMealGeneratePlanRequestData(
                startDate: '2026-09-01',
                endDate: '2026-09-10',
                serving_size: 1,
            ),
        );

        expect(
            PlannedMeal::query()
                ->where('workspace_id', $this->user->defaultWorkspace()->id)
                ->distinct('planned_date')
                ->count('planned_date'),
        )->toBe(10);
    });

    test('replaces only meals inside the requested range', function () {
        /** @var \Tests\TestCase $this */
        $this->setUpRecipeContext();

        PlannedMeal::query()->create([
            'workspace_id' => $this->user->defaultWorkspace()->id,
            'user_id' => $this->user->id,
            'recipe_id' => $this->recipe->id,
            'meal_time_id' => $this->mealTime->id,
            'planned_date' => '2026-08-31',
            'serving_size' => 1,
        ]);

        app(PlannedMealGeneratePlanAction::class)->execute(
            $this->user,
            $this->user->defaultWorkspace(),
            new PlannedMealGeneratePlanRequestData(
                startDate: '2026-09-01',
                endDate: '2026-09-03',
                serving_size: 1,
            ),
        );

        expect(
            PlannedMeal::query()
                ->where('workspace_id', $this->user->defaultWorkspace()->id)
                ->whereDate('planned_date', '2026-08-31')
                ->exists(),
        )->toBeTrue();
    });

    test('throws AuthorizationException when viewer attempts to generate a plan', function () {
        /** @var \Tests\TestCase $this */
    });

    test('throws InvalidArgumentException when generating plan with invalid date range', function () {
        /** @var \Tests\TestCase $this */
        expect(fn () => app(PlannedMealGeneratePlanAction::class)->execute(
            $this->user,
            $this->user->defaultWorkspace(),
            new PlannedMealGeneratePlanRequestData(
                startDate: '2026-09-03',
                endDate: '2026-09-01',
                serving_size: 1,
            ),
        ))->toThrow(InvalidArgumentException::class);
    });
});
