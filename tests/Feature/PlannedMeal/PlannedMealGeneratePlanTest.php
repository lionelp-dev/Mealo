<?php

namespace Tests\Feature\PlannedMeal;

use App\Messages\PlannedMeal\MealPlanGeneratedMessage;

beforeEach(function () {
    /** @var \Tests\TestCase $this */
    $this->setUpRecipeContext();
});

describe('PlannedMealGeneratePlan', function () {
    describe('success messages', function () {
        test('when date range is valid', function () {
            /** @var \Tests\TestCase $this */
            $this->actingAs($this->user)
                ->post(route('meal-planning.generate'), [
                    'startDate' => '2026-09-01',
                    'endDate' => '2026-09-03',
                    'serving_size' => 2,
                ])
                ->assertSessionHas(
                    'success',
                    MealPlanGeneratedMessage::forCreatedCount(
                        \App\Models\PlannedMeal::query()->count()
                    ),
                );
        });
    });

    describe('error messages', function () {
        test('when date range is invalid', function () {
            /** @var \Tests\TestCase $this */
            $this->actingAs($this->user)
                ->post(route('meal-planning.generate'), [
                    'startDate' => '2026-09-03',
                    'endDate' => '2026-09-01',
                    'serving_size' => 1,
                ])
                ->assertSessionHasErrors('endDate');
        });
    });

    describe('forbidden messages', function () {
        test('when viewer attempts', function () {
            /** @var \Tests\TestCase $this */
        });
    });
});
