<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ShoppingListIngredient>
 */
class ShoppingListIngredientFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'shopping_list_id' => \App\Models\ShoppingList::factory(),
            'ingredient_id' => \App\Models\Ingredient::factory(),
            'quantity' => $this->faker->randomFloat(2, 0.1, 10),
            'unit' => $this->faker->randomElement(['cups', 'tsp', 'tbsp', 'pieces', 'g', 'kg', 'ml', 'l']),
            'is_checked' => $this->faker->boolean(20), // 20% chance of being checked
        ];
    }
}
