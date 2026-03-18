<?php

namespace App\Jobs;

use App\Actions\Recipes\GenerateRecipeWithAIAction;
use App\Actions\Recipes\StoreRecipeAction;
use App\Data\Recipe\Requests\GenerateRecipeRequestData;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GenerateRecipeJob implements ShouldQueue
{
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public int $tries = 3;

    public int $timeout = 120;

    public int $backoff = 30;

    public function __construct(
        public int $userId,
        public string $prompt,
        public int $recipeNumber
    ) {
        $this->onQueue('recipes');
    }

    public function handle(
        GenerateRecipeWithAIAction $generateRecipeWithAIAction,
        StoreRecipeAction $storeRecipeAction
    ): void {
        try {
            echo "🔄 Generating recipe #{$this->recipeNumber}: {$this->prompt}\n";

            // Generate recipe data from AI
            $generateRecipeData = GenerateRecipeRequestData::validateAndCreate(['prompt' => $this->prompt]);
            $storeRecipeData = $generateRecipeWithAIAction->execute($generateRecipeData);

            $user = User::query()->find($this->userId);

            if (! $user) {
                throw new \Exception('User not found');
            }
            // Store recipe with all relations
            $recipe = $storeRecipeAction->execute($user, $storeRecipeData);

            echo "✅ Recipe #{$this->recipeNumber} created: {$recipe->name}\n";
            Log::info("Recipe generated via queue: {$recipe->name}");

        } catch (\Exception $e) {
            echo "❌ Failed recipe #{$this->recipeNumber}: {$e->getMessage()}\n";
            Log::error("Recipe generation failed: {$this->prompt} - {$e->getMessage()}");
            throw $e;
        }
    }
}
