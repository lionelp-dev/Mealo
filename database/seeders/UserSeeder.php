<?php

namespace Database\Seeders;

use App\Models\Recipe;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::query()->firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'email_verified_at' => Carbon::now(),
            ]
        );

        Recipe::factory()
           ->count(40)
           ->withMealTime(2)
           ->withIngredients(10)
           ->withSteps(10)
           ->withTags(5)
           ->create(['user_id' => $user->id]);

    }
}
