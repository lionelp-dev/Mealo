<?php

namespace App\Listeners;

use App\Actions\Recipes\RecipeGenerateStarterPackAction;
use App\Models\User;
use Illuminate\Auth\Events\Registered;

class GenerateStarterRecipesForNewUser
{
    public function __construct(
        private readonly RecipeGenerateStarterPackAction $generateStarterPack,
    ) {}

    public function handle(Registered $event): void
    {
        $user = $event->user;

        if (! $user instanceof User) {
            return;
        }

        $this->generateStarterPack->execute(
            $user,
            RecipeGenerateStarterPackAction::SIGNUP_RECIPES_PER_MEAL_TIME,
            imageGeneration: true,
        );
    }
}
