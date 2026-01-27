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
        $user = \App\Models\User::factory()->create();
        $recipe = \App\Models\Recipe::factory()->create(['user_id' => $user->id]);

        return [
            'user_id' => $user->id,
            'recipe_id' => $recipe->id,
            'planned_date' => $this->faker->date(),
            'meal_time_id' => \App\Models\MealTime::query()->inRandomOrder()->first()->id,
            'workspace_id' => $user->getPersonalWorkspace()->id,
        ];
    }
}
