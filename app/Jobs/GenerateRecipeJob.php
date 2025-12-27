<?php

namespace App\Jobs;

use App\Http\Requests\StoreRecipeRequest;
use App\Models\Recipe;
use App\Models\User;
use App\Services\AIRecipeGenerationService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Validator as ValidationValidator;

class GenerateRecipeJob implements ShouldQueue
{
    use Queueable;
    use InteractsWithQueue;
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

    public function handle(AIRecipeGenerationService $aiService): void
    {
        $user = User::find($this->userId);

        try {
            echo "🔄 Generating recipe #{$this->recipeNumber}: {$this->prompt}\n";

            $recipeData = $aiService->generateRecipe($this->prompt);

            $validated = $this->validateRecipeData($recipeData)->validated();

            $recipe = Recipe::create([
                'user_id' => $user->id,
                'name' => $validated['name'],
                'description' => $validated['description'],
                'preparation_time' => $validated['preparation_time'],
                'cooking_time' => $validated['cooking_time'],
            ]);

            $recipe->syncIngredients($recipeData['ingredients']);
            $recipe->syncSteps($recipeData['steps']);
            $recipe->syncTags($recipeData['tags']);
            $recipe->syncMealTimes($recipeData['meal_times']);

            echo "✅ Recipe #{$this->recipeNumber} created: {$recipe->name}\n";
            Log::info("Recipe generated via queue: {$recipe->name}");

        } catch (\Exception $e) {
            echo "❌ Failed recipe #{$this->recipeNumber}: {$e->getMessage()}\n";
            Log::error("Recipe generation failed: {$this->prompt} - {$e->getMessage()}");
            throw $e;
        }
    }

    private function validateRecipeData(array $recipeData): ValidationValidator
    {
        $validator = Validator::make($recipeData, (new StoreRecipeRequest())->rules());

        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            echo "⚠️ Validation failed:\n";
            foreach ($errors as $error) {
                echo "  - {$error}\n";
            }
            throw new \Exception("Recipe validation failed: " . implode(', ', $errors));
        }

        echo "✅ Recipe data validation passed\n";
        return $validator;
    }
}
