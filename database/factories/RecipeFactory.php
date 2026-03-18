<?php

namespace Database\Factories;

use App\Actions\Recipes\SyncRecipeIngredientsAction;
use App\Actions\Recipes\SyncRecipeMealTimesAction;
use App\Actions\Recipes\SyncRecipeTagsAction;
use App\Data\Recipe\Entities\IngredientData;
use App\Data\Recipe\Entities\MealTimeData;
use App\Data\Recipe\Entities\StepData;
use App\Data\Recipe\Entities\TagData;
use App\Models\Ingredient;
use App\Models\MealTime;
use App\Models\Recipe;
use App\Models\RecipeIngredient;
use App\Models\Step;
use App\Models\Tag;
use App\Models\User;
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
            'user_id' => User::factory(),
            'name' => fake()->words(5, true),
            'description' => fake()->paragraph(),
            'preparation_time' => fake()->numberBetween(0, 60),
            'cooking_time' => fake()->numberBetween(0, 60),
            'serving_size' => fake()->numberBetween(1, 12),
        ];
    }

    /**
     * Attach random existing meal times to the recipe.
     *
     * @param  int  $count  Number of meal times to attach
     */
    public function withMealTime($count): static
    {
        return $this->afterMaking(function (Recipe $recipe) use ($count) {
            $recipe->setRelation('mealTimes', MealTime::query()->inRandomOrder()->limit($count)->get());
        })->afterCreating(function (Recipe $recipe) use ($count) {
            $mealTimes = MealTime::query()->inRandomOrder()->limit($count)->get();
            $mealTimesData = collect($mealTimes)->map(function ($mealTime) {
                return MealTimeData::from([
                    'id' => $mealTime->id,
                    'name' => $mealTime->name,
                ]);
            })->all();

            app(SyncRecipeMealTimesAction::class)($recipe, $mealTimesData);
        });
    }

    /**
     * Create and attach ingredients with pivot data to the recipe.
     *
     * @param  int  $count  Number of ingredients to create and attach
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
            $ingredients = Ingredient::factory()->count($count)->make()->map(function ($ingredient) {
                $pivot = RecipeIngredient::factory()->make();

                return [
                    'name' => $ingredient->name,
                    'quantity' => $pivot->quantity,
                    'unit' => $pivot->unit,
                ];
            });

            $ingredientsData = collect($ingredients)->map(fn($ingredient) => IngredientData::from($ingredient))->all();

            app(SyncRecipeIngredientsAction::class)($recipe, $ingredientsData);
        });
    }

    /**
     * Create and associate preparation steps with the recipe.
     *
     * @param  int  $count  Number of steps to create
     */
    public function withSteps($count): static
    {
        return $this->afterMaking(function (Recipe $recipe) use ($count) {
            $recipe->setRelation('steps', Step::factory()->count($count)->make());
        })->afterCreating(function (Recipe $recipe) use ($count) {
            $steps = Step::factory()->count($count)->make();
            $stepsData = collect($steps)->map(fn($step) => StepData::from($step)->transform())->all();
            $recipe->steps()->createMany($stepsData);
        });
    }

    /**
     * Create and attach tags to the recipe.
     *
     * @param  int  $count  Number of tags to create and attach
     */
    public function withTags($count): static
    {
        return $this->afterMaking(function (Recipe $recipe) use ($count) {
            $recipe->setRelation('tags', Tag::factory()->count($count)->make());
        })->afterCreating(function (Recipe $recipe) use ($count) {
            $tags = Tag::factory()->count($count)->make()->map(fn($tag) => new TagData(
                id: null,
                name: $tag->name,
            ));

            $tagsData = collect($tags)->map(fn($tag) => TagData::from($tag))->all();

            app(SyncRecipeTagsAction::class)($recipe, $tagsData);
        });
    }
}
