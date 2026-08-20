<?php

namespace App\Jobs;

use App\Actions\Recipes\RecipeAIGenerationAction;
use App\Actions\Recipes\RecipeStoreAction;
use App\Data\Requests\Recipe\RecipeAIGenerationRequestData;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class RecipeAIGenerationJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public const QUEUE = 'recipes-ai-generation';

    public function __construct(
        public int $userId,
        public RecipeAIGenerationRequestData $recipeAIGenerationRequestData,
    ) {}

    public function handle(
        RecipeAIGenerationAction $recipeAIGenerationAction,
        RecipeStoreAction $recipeStoreAction,
    ): void {
        try {
            $payload = $this->recipeAIGenerationRequestData->aiPayload();
            $prompt = $payload['message']['content'];
            $mealTime = $payload['context']['meal_time'];

            echo 'Generating recipe for '
                .($mealTime ?? 'unspecified meal time')
                .": {$prompt}\n";

            $user = User::query()->find($this->userId);

            if (! $user) {
                throw new \Exception('User not found');
            }

            $withImages = $this->recipeAIGenerationRequestData->image_generation ?? false;
            $recipes = $recipeAIGenerationAction->execute($this->recipeAIGenerationRequestData, $withImages);

            if ($recipes === []) {
                throw new \Exception('No recipe generated from AI response.');
            }

            foreach ($recipes as $generatedRecipe) {
                $recipeStoreAction->execute(
                    $user,
                    $generatedRecipe,
                );
            }

            Log::info('Recipes generated via queue.', [
                'count' => count($recipes),
                'meal_time' => $mealTime,
            ]);

        } catch (\Exception $e) {
            $payload = $this->recipeAIGenerationRequestData->aiPayload();
            $prompt = $payload['message']['content'];

            echo "Failed recipe generation: {$e->getMessage()}\n";
            Log::error("Recipe generation failed: {$prompt} - {$e->getMessage()}");
            throw $e;
        }
    }
}
