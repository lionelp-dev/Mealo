<?php

namespace Database\Seeders;

use App\Enums\MealTimeEnum;
use App\Models\MealTime;
use Illuminate\Database\Seeder;

class MealTimeSeeder extends Seeder
{
    public function run(): void
    {
        MealTime::query()->upsert(
            array_map(
                fn (MealTimeEnum $mealTime) => [
                    'name' => $mealTime->label(),
                    'slug' => $mealTime->value,
                ],
                MealTimeEnum::cases()
            ),
            ['slug'],
            ['name']
        );
    }
}
