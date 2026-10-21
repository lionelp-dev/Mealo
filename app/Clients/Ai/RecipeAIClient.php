<?php

namespace App\Clients\Ai;

use App\Data\Requests\Recipe\RecipeAIGenerationRequestData;
use App\Data\Requests\Recipe\RecipeDiscoveryRequestData;
use App\Models\IngredientCategory;
use App\Models\MealTime;
use App\Models\User;
use RuntimeException;
use UnexpectedValueException;

final class RecipeAIClient
{
    public function __construct(
        private AIHttpClient $http,
    ) {}

    /**
     * @return array<int, array<string, mixed>>
     */
    public function generate(RecipeAIGenerationRequestData $payload, bool $generateImages = false): array
    {
        $response = $this->http->post(
            '/internal/recipes/generate',
            $payload->aiPayload($generateImages),
            90,
        );

        if ($response->failed()) {
            throw new RuntimeException(
                "AI recipe generation request failed with status {$response->status()}."
            );
        }

        $data = $response->json();

        if (! is_array($data) || ! array_key_exists('recipes', $data) || ! is_array($data['recipes'])) {
            throw new UnexpectedValueException('AI recipe generation response must contain a recipes array.');
        }

        /** @var array<int, array<string, mixed>> $recipes */
        $recipes = $data['recipes'];

        return $recipes;
    }

    /**
     * @return array{recipes: array<int, array<string, mixed>>, failedRecipeCount: int}
     */
    public function discover(RecipeDiscoveryRequestData $payload, User $user): array
    {
        $mealTimeCatalog = MealTime::query()
            ->orderBy('id')
            ->get(['id', 'slug'])
            ->map(fn (MealTime $mealTime): array => [
                'id' => $mealTime->id,
                'slug' => $mealTime->slug,
            ])
            ->all();

        $response = $this->http->post('/internal/recipes/discover', [
            'owner_id' => $user->id,
            'prompt' => $payload->prompt,
            'ingredient_categories' => IngredientCategory::query()
                ->orderBy('id')
                ->get(['id', 'slug', 'name'])
                ->map(fn (IngredientCategory $category): array => [
                    'id' => $category->id,
                    'slug' => $category->slug,
                    'name' => $category->name,
                ])
                ->all(),
            'meal_times' => $mealTimeCatalog,
            'selected_meal_times' => $payload->meal_times,
            'existing_recipe_names' => $user->recipes()
                ->pluck('name')
                ->all(),
        ], 180);

        if ($response->failed()) {
            throw new RuntimeException(
                "AI recipe discovery request failed with status {$response->status()}."
            );
        }

        $data = $response->json();

        if (! is_array($data) || ! is_array($data['recipes'] ?? null) || ! is_int($data['failedRecipeCount'] ?? null)) {
            throw new UnexpectedValueException('AI recipe discovery response has an invalid shape.');
        }

        /** @var array{recipes: array<int, array<string, mixed>>, failedRecipeCount: int} $data */
        return $data;
    }
}
