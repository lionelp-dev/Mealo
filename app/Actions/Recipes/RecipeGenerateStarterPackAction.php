<?php

namespace App\Actions\Recipes;

use App\Data\Requests\Recipe\RecipeAIGenerationRequestData;
use App\Jobs\RecipeAIGenerationJob;
use App\Models\MealTime;
use App\Models\User;
use Illuminate\Support\Facades\Bus;

class RecipeGenerateStarterPackAction
{
    public const SIGNUP_RECIPES_PER_MEAL_TIME = 5;

    public function execute(
        User $user,
        int $recipesPerMealTime = 5,
        bool $imageGeneration = false,
    ): void {
        $mealTimes = MealTime::query()->orderBy('id')->get(['name']);

        if ($mealTimes->isEmpty()) {
            return;
        }

        $jobs = $mealTimes->map(
            fn (MealTime $mealTime): RecipeAIGenerationJob => new RecipeAIGenerationJob(
                $user->id,
                RecipeAIGenerationRequestData::validateAndCreate([
                    'message' => [
                        'role' => 'user',
                        'content' => RecipeAIGenerationRequestData::DEFAULT_MESSAGE_CONTENT,
                    ],
                    'context' => [
                        'meal_time' => $mealTime->name,
                        'count' => $recipesPerMealTime,
                    ],
                    'image_generation' => $imageGeneration,
                ]),
            )->onQueue(RecipeAIGenerationJob::QUEUE),
        )->all();

        Bus::chain($jobs)
            ->onQueue(RecipeAIGenerationJob::QUEUE)
            ->dispatch();
    }
}
