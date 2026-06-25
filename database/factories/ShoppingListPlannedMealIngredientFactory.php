<?php

namespace Database\Factories;

use App\Enums\Unit;
use App\Models\Ingredient;
use App\Models\PlannedMeal;
use App\Models\ShoppingList;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ShoppingListPlannedMealIngredient>
 */
class ShoppingListPlannedMealIngredientFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'shopping_list_id' => ShoppingList::factory(),
            'planned_meal_id' => PlannedMeal::factory(),
            'ingredient_id' => Ingredient::factory(),
            'unit' => fake()->randomElement(Unit::values()),
            'is_checked' => false,
        ];
    }

    /**
     * Indicate that the ingredient is checked.
     */
    public function checked(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_checked' => true,
        ]);
    }

    /**
     * Indicate that the ingredient is unchecked.
     */
    public function unchecked(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_checked' => false,
        ]);
    }
}
