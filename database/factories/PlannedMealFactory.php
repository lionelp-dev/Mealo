<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PlannedMeal>
 */
class PlannedMealFactory extends Factory
{

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'planned_date' => $this->faker->date(),
            'meal_time_id' => \App\Models\MealTime::query()->inRandomOrder()->first()->id,
        ];
    }
}
