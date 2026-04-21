<?php

namespace App\Services;

use App\Data\Resources\Recipe\RecipeAIPromptResourceData;
use App\Models\MealTime;
use App\Models\Recipe;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Log;

class AIMealPlanningService
{
    private $client;

    public function __construct()
    {
        $this->client = app('openai.client');
    }

    /**
     * Generate a meal plan using user recipes with function calling
     */
    public function generateMealPlan(array $params): array
    {
        // Extract parameters from array
        $userId = $params['userId'];
        $workspaceId = $params['workspaceId'];
        $startDate = new Carbon($params['startDate']);
        $endDate = new Carbon($params['endDate']);
        $days = Carbon::parse($startDate)
            ->diffInDays(
                Carbon::parse($endDate)
            ) + 1;

        // Récupérer un échantillon aléatoire de recettes pour optimiser
        $totalRecipes = Recipe::where('user_id', $userId)->count();
        $limit = min(25, $totalRecipes); // Plus de recettes pour plus de variété
        $randomOffset = $totalRecipes > $limit ? random_int(0, $totalRecipes - $limit) : 0;

        $recipes = Recipe::where('user_id', $userId)
            ->with(['mealTimes:id,name', 'tags:id,name'])
            ->select('id', 'name', 'serving_size')
            ->offset($randomOffset)
            ->limit($limit)
            ->get();

        if ($recipes->isEmpty()) {
            throw new Exception('Aucune recette trouvée pour cet utilisateur.');
        }

        // Get available meal times from database
        $mealTimes = MealTime::all();
        $availableMealTimes = $mealTimes->map(fn($mt) => ['id' => $mt->id, 'name' => $mt->name])->toArray();
        $mealTimeListForPrompt = json_encode($availableMealTimes);

        // Filter recipes by meal_time to prevent inappropriate assignments
        $breakfastRecipes = $recipes->filter(function ($recipe) {
            return $recipe->mealTimes->contains('name', 'breakfast');
        });

        $lunchRecipes = $recipes->filter(function ($recipe) {
            return $recipe->mealTimes->contains('name', 'lunch');
        });

        $dinnerRecipes = $recipes->filter(function ($recipe) {
            return $recipe->mealTimes->contains('name', 'diner');
        });

        $snackRecipes = $recipes->filter(function ($recipe) {
            return $recipe->mealTimes->contains('name', 'snack');
        });

        // Formater les recettes par meal_time
        $breakfastData = RecipeAIPromptResourceData::collect($breakfastRecipes, \Spatie\LaravelData\DataCollection::class);
        $lunchData = RecipeAIPromptResourceData::collect($lunchRecipes, \Spatie\LaravelData\DataCollection::class);
        $dinnerData = RecipeAIPromptResourceData::collect($dinnerRecipes, \Spatie\LaravelData\DataCollection::class);
        $snackData = RecipeAIPromptResourceData::collect($snackRecipes, \Spatie\LaravelData\DataCollection::class);

        $filteredRecipesData = [
            'breakfast' => $breakfastData,
            'lunch' => $lunchData,
            'dinner' => $dinnerData,
            'snack' => $snackData,
        ];

        try {
            $response = $this->client->chat()->create([
                'model' => 'gemini-3-flash-preview',
                'tools' => [
                    [
                        'type' => 'function',
                        'function' => [
                            'name' => 'generate_meal_plan',
                            'description' => "Generate a {$days} meal plan using available recipes",
                            'parameters' => [
                                'type' => 'object',
                                'properties' => [
                                    'planned_meals' => [
                                        'type' => 'array',
                                        'description' => "Array of planned meals for {$days} days",
                                        'items' => [
                                            'type' => 'object',
                                            'properties' => [
                                                'recipe_id' => [
                                                    'type' => 'string',
                                                    'format' => 'uuid',
                                                    'description' => 'Recipe UUID from the available recipes',
                                                ],
                                                'planned_date' => [
                                                    'type' => 'string',
                                                    'format' => 'date',
                                                    'description' => 'Date for the planned meal (YYYY-MM-DD format)',
                                                ],
                                                'meal_time_id' => [
                                                    'type' => 'integer',
                                                    'description' => "Meal time ID from this exact list: {$mealTimeListForPrompt}",
                                                ],
                                            ],
                                            'required' => ['recipe_id', 'planned_date', 'meal_time_id'],
                                        ],
                                    ],
                                ],
                                'required' => ['planned_meals'],
                            ],
                        ],
                    ],
                ],
                'tool_choice' => ['type' => 'function', 'function' => ['name' => 'generate_meal_plan']],
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => '🧠 GÉNÉRATEUR DE PLANNING DE REPAS — MODE TIMELINE STRICT

        Tu es un moteur de planification de repas DÉTERMINISTE.
        Tu produis UNIQUEMENT un planning JSON exploitable par un backend.
        AUCUNE liberté créative.

        ────────────────────────────────────────
        📦 SOURCE UNIQUE DE VÉRITÉ
        ────────────────────────────────────────

        Recettes filtrées par meal_time :
        ' . json_encode($filteredRecipesData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "

        Meal times autorisés :
        {$mealTimeListForPrompt}

   ────────────────────────────────────────
        🍳 CLUSTERING & DLC — STRICT
        ────────────────────────────────────────

        - Une recette répétée DOIT être utilisée sur des jours STRICTEMENT consécutifs
        - INTERDICTION ABSOLUE de toute réapparition après interruption
        - MAXIMUM 6 utilisations consécutives par recette (optimisation courses)
        - PRIORISER les recettes avec le PLUS d'ingrédients communs
        - PRIVILÉGIER les ingrédients polyvalents (œufs, riz, pâtes, poulet, légumes de base)
        - INTERDICTION de sélectionner une recette nécessitant un ingrédient unique/non réutilisable
        - Toute violation = PLANNING INVALIDE

        ────────────────────────────────────────
        🛒 OPTIMISATION LISTE DE COURTES — STRICT
        ────────────────────────────────────────

        - OBJECTIF : MINIMISER le nombre d'ingrédients uniques
        - REGROUPEMENT : Les mêmes ingrédients doivent être utilisés par le MAXIMUM de recettes
        - SELECTION : Choisir les recettes qui partagent les ingrédients les plus courants
        - CONTRAINTE : Chaque ingrédient introduit doit être utilisé dans au moins 3 recettes du planning

        ────────────────────────────────────────
        🧮 PROPORTIONS & QUANTITÉS — STRICT
        ────────────────────────────────────────

        - Les proportions et quantités des recettes sont IMMUTABLES
        - INTERDICTION de modifier, ajuster, optimiser ou arrondir
        - Si une recette est utilisée N fois → ses quantités sont comptées N fois
        - Respect STRICT de la serving_size
        - L’IA NE CALCULE PAS les courses

        Si une quantité n’est pas explicitement fournie :
        → NE PAS l’inventer

        ────────────────────────────────────────
        ⚙️ CONTRAINTES TECHNIQUES — STRICT
        ────────────────────────────────────────
        - Période : {$days} jours consécutifs
        - Date de début : {$startDate->format('Y-m-d')}
        - Dates au format YYYY-MM-DD
        - Utiliser UNIQUEMENT les recipe_id fournis
        - Respect STRICT des meal_time_id
        - TOTAL ATTENDU : {$days} jours × 4 repas = " . ($days * 4) . ' repas
        ',
                    ],
                    [
                        'role' => 'user',
                        'content' => "Crée-moi un planning de repas équilibré pour {$days} jours avec mes recettes disponibles.",
                    ],
                ],
            ]);

            // Parse the function calling response
            if (isset($response->choices[0]->message->toolCalls)) {
                foreach ($response->choices[0]->message->toolCalls as $toolCall) {
                    if ($toolCall->function->name === 'generate_meal_plan') {
                        $args = json_decode($toolCall->function->arguments, true);
                        $plannedMeals = $args['planned_meals'];

                        // Validate recipe IDs before returning
                        return $this->validateRecipeIds($plannedMeals, $userId);
                    }
                }
            }

            // For backward compatibility with mocked responses
            if (isset($response->choices[0]->message->content)) {
                $content = $response->choices[0]->message->content;
                if (is_string($content)) {
                    $data = json_decode($content, true);
                    if ($data) {
                        $plannedMeals = $data['planned_meals'] ?? [];

                        return $this->validateRecipeIds($plannedMeals, $userId);
                    }
                }
            }

            throw new Exception('No valid meal plan generated from AI response');
        } catch (Exception $e) {
            throw new Exception("Ce service n'est pas disponible pour le moment");
        }
    }

    /**
     * Validate recipe IDs from AI response and filter invalid ones
     */
    private function validateRecipeIds(array $plannedMeals, string $userId): array
    {
        // Extract all recipe IDs from AI response
        $recipeIds = array_unique(array_column($plannedMeals, 'recipe_id'));

        // Verify which recipe IDs exist in the database for this user
        $validRecipeIds = Recipe::where('user_id', $userId)
            ->whereIn('id', $recipeIds)
            ->pluck('id')
            ->toArray();

        // Filter planned meals to only include valid recipe IDs
        $validPlannedMeals = array_filter($plannedMeals, function ($meal) use ($validRecipeIds) {
            return in_array($meal['recipe_id'], $validRecipeIds);
        });

        // Log invalid recipe IDs if any
        $invalidRecipeIds = array_diff($recipeIds, $validRecipeIds);
        if (! empty($invalidRecipeIds)) {
            Log::warning('OpenAI returned invalid recipe IDs during meal plan generation', [
                'user_id' => $userId,
                'invalid_recipe_ids' => $invalidRecipeIds,
                'valid_count' => count($validPlannedMeals),
                'total_count' => count($plannedMeals),
            ]);
        }

        // Throw exception if no valid meals remain
        if (empty($validPlannedMeals)) {
            throw new Exception('No valid meal plans could be generated');
        }

        return array_values($validPlannedMeals);
    }
}
