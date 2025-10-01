<?php

namespace Database\Seeders;

use App\Models\Recipe;
use App\Models\User;
use Illuminate\Database\Seeder;

class RecipeSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::query()->where('email', 'test@example.com')->first();

        Recipe::factory()
            ->count(20)
            ->withMealTime(2)
            ->withIngredients(10)
            ->withSteps(10)
            ->withTags(5)
            ->create(['user_id' => $user->id]);
    }
}
