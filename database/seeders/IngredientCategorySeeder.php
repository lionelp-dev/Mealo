<?php

namespace Database\Seeders;

use App\Enums\IngredientCategoryEnum;
use App\Models\IngredientCategory;
use Illuminate\Database\Seeder;

class IngredientCategorySeeder extends Seeder
{
    public function run(): void
    {
        IngredientCategory::query()->upsert(
            array_map(
                fn (IngredientCategoryEnum $category) => [
                    'name' => $category->label(),
                    'slug' => $category->value,
                ],
                IngredientCategoryEnum::cases()
            ),
            ['slug'],
            ['name']
        );
    }
}
