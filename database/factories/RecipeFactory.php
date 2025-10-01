<?php

namespace Database\Factories;

use App\Models\Ingredient;
use App\Models\MealTime;
use App\Models\Recipe;
use App\Models\RecipeIngredient;
use App\Models\Step;
use App\Models\Tag;
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

    /**
     * Attach random existing meal times to the recipe.
     *
     * @param int $count Number of meal times to attach
     * @return static
     */
    public function withMealTime($count): static
    {
        return $this->afterMaking(function (Recipe $recipe) use ($count) {
            $recipe->setRelation('mealTimes', MealTime::query()->inRandomOrder()->limit($count)->get());
        })->afterCreating(function (Recipe $recipe) use ($count) {
            $recipe->attachMealTimes(MealTime::query()->inRandomOrder()->limit($count)->get());
        });
    }

    /**
     * Create and attach ingredients with pivot data to the recipe.
     *
     * @param int $count Number of ingredients to create and attach
     * @return static
     */
    public function withIngredients($count): static
    {
        return $this->afterMaking(function (Recipe $recipe) use ($count) {
            $ingredients = Ingredient::factory()->count($count)->make()->map(function ($ingredient) {
                $ingredient->pivot = RecipeIngredient::factory()->make();
                return $ingredient;
            });
            $recipe->setRelation('ingredients', $ingredients);
        })->afterCreating(function (Recipe $recipe) use ($count) {
            $recipe->attachIngredients(Ingredient::factory()->count($count)->make()->map(function ($ingredient) {
                return array_merge(
                    $ingredient->toArray(),
                    RecipeIngredient::factory()->make()->toArray()
                );
            })->toArray());
        });
    }

    /**
     * Create and associate preparation steps with the recipe.
     *
     * @param int $count Number of steps to create
     * @return static
     */
    public function withSteps($count): static
    {
        return $this->afterMaking(function (Recipe $recipe) use ($count) {
            $recipe->setRelation('steps', Step::factory()->count($count)->make());
        })->afterCreating(function (Recipe $recipe) use ($count) {
            $recipe->steps()->createMany(Step::factory()->count($count)->make()->toArray());
        });
    }

    /**
     * Create and attach tags to the recipe.
     *
     * @param int $count Number of tags to create and attach
     * @return static
     */
    public function withTags($count): static
    {
        return $this->afterMaking(function (Recipe $recipe) use ($count) {
            $recipe->setRelation('tags', Tag::factory()->count($count)->make());
        })->afterCreating(function (Recipe $recipe) use ($count) {
            $recipe->attachTags(Tag::factory()->count($count)->make()->toArray());
        });
    }
}
