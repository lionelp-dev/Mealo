<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Recipe>
 */
class RecipeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(5, true),
            'description' => fake()->paragraph(),
            'preparation_time' => fake()->numberBetween(0, 60),
            'cooking_time' => fake()->numberBetween(0, 60),
        ];
    }
}
