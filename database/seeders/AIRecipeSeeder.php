<?php

namespace Database\Seeders;

use App\Actions\Recipes\RecipeGenerateStarterPackAction;
use App\Models\User;
use Illuminate\Database\Seeder;

class AIRecipeSeeder extends Seeder
{
    private const RECIPES_PER_MEAL_TIME = 10;

    public function __construct(
        private User $user,
    ) {}

    public function run(): void
    {
        app(RecipeGenerateStarterPackAction::class)->execute(
            $this->user,
            self::RECIPES_PER_MEAL_TIME,
        );
    }
}
