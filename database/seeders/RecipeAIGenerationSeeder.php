<?php

namespace Database\Seeders;

use App\Actions\Recipes\RecipeGenerateStarterPackAction;
use App\Models\User;
use Illuminate\Database\Seeder;

class RecipeAIGenerationSeeder extends Seeder
{
    private const RECIPES_PER_MEAL_TIME = 5;

    public function __construct(
        private User $user,
        private bool $imageGeneration = true,
    ) {}

    public function run(): void
    {
        app(RecipeGenerateStarterPackAction::class)->execute(
            $this->user,
            self::RECIPES_PER_MEAL_TIME,
            $this->imageGeneration
        );
    }
}
