<?php

namespace Database\Seeders;

use App\Models\Ingredient;
use App\Models\MealTime;
use App\Models\Recipe;
use App\Models\RecipeIngredient;
use App\Models\Step;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;

class RecipeSeeder extends Seeder
{
    public function run(): void
    {
        $test_user = User::query()->where('email', 'test@example.com')->first();

        Recipe::factory()->count(20)
            ->hasAttached(
                MealTime::query()->inRandomOrder()->limit(2)->get()
            )
            ->hasAttached(
                Ingredient::factory()->count(10),
                fn() => RecipeIngredient::factory()->make()->toArray()
            )
            ->has(
                Step::factory()->count(10),
            )
            ->has(
                Tag::factory()->count(10),
            )->create(['user_id' => $test_user->id]);
    }
}
