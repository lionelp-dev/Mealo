<?php

namespace App\Services;

use App\Models\Recipe;
use App\Models\MealTime;
use App\Models\PlannedMeal;
use App\Http\Resources\RecipeResource;
use Carbon\Carbon;
use Exception;

class AIMealPlanningService
{
    private $client;

    public function __construct()
    {
        $this->client = app('openai.client');
    }

    /**
     * Generate a meal plan using user recipes with function calling
     * @return array
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

        // Supprimer les repas planifiés existants pour ce range dans le workspace
        PlannedMeal::where('user_id', $userId)
            ->where('workspace_id', $workspaceId)
            ->whereBetween('planned_date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
            ->delete();

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
            return $recipe->mealTimes->contains('name', 'dinner');
        });

        $snackRecipes = $recipes->filter(function ($recipe) {
            return $recipe->mealTimes->contains('name', 'snack');
        });

        // Formater les recettes par meal_time
        $breakfastData = RecipeResource::collection($breakfastRecipes)->resolve();
        $lunchData = RecipeResource::collection($lunchRecipes)->resolve();
        $dinnerData = RecipeResource::collection($dinnerRecipes)->resolve();
        $snackData = RecipeResource::collection($snackRecipes)->resolve();

        $filteredRecipesData = [
            'breakfast' => $breakfastData,
            'lunch' => $lunchData,
            'dinner' => $dinnerData,
            'snack' => $snackData,
        ];

        try {
            $response = $this->client->chat()->create([
                'model' => 'openai/gpt-5-mini',
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
                                                    'type' => 'integer',
                                                    'description' => 'Recipe ID from the available recipes',
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
                        'content' => "🧠 GÉNÉRATEUR DE PLANNING DE REPAS — MODE TIMELINE STRICT

        Tu es un moteur de planification de repas DÉTERMINISTE.
        Tu produis UNIQUEMENT un planning JSON exploitable par un backend.
        AUCUNE liberté créative.

        ────────────────────────────────────────
        📦 SOURCE UNIQUE DE VÉRITÉ
        ────────────────────────────────────────

        Recettes filtrées par meal_time :
        " . json_encode($filteredRecipesData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "

        Meal times autorisés :
        {$mealTimeListForPrompt}

        ────────────────────────────────────────
        🕒 MODE DE CONSTRUCTION OBLIGATOIRE — STRICT
        ────────────────────────────────────────

        1. Construire une TIMELINE jour par jour (dates STRICTEMENT croissantes)
        2. Pour chaque jour, générer EXACTEMENT 4 repas dans l'ordre :
           - 1 breakfast (utiliser le meal_time_id correspondant à 'breakfast' dans la liste)
           - 1 lunch (utiliser le meal_time_id correspondant à 'lunch' dans la liste)
           - 1 dinner (utiliser le meal_time_id correspondant à 'dinner' dans la liste)
           - 1 snack (utiliser le meal_time_id correspondant à 'snack' dans la liste)
        3. INTERDICTION de raisonner par type de repas
        4. INTERDICTION de recomposer après coup

        Meal times disponibles avec leurs IDs exacts :
        {$mealTimeListForPrompt}

        ────────────────────────────────────────
        🍳 CLUSTERING & DLC — STRICT
        ────────────────────────────────────────

        - Une recette répétée DOIT être utilisée sur des jours STRICTEMENT consécutifs
        - INTERDICTION ABSOLUE de toute réapparition après interruption
        - MAXIMUM 3 utilisations consécutives par recette
        - Toute violation = PLANNING INVALIDE

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
        - TOTAL ATTENDU : {$days} jours × 4 repas = " . ($days * 4) . " repas
        ",
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
                        return $args['planned_meals'];
                    }
                }
            }

            // For backward compatibility with mocked responses
            if (isset($response->choices[0]->message->content)) {
                $content = $response->choices[0]->message->content;
                if (is_string($content)) {
                    $data = json_decode($content, true);
                    if ($data) {
                        return $data['planned_meals'] ?? [];
                    }
                }
            }

            throw new Exception('No valid meal plan generated from AI response');

        } catch (Exception $e) {
            throw new Exception('Failed to generate meal plan: ' . $e->getMessage());
        }
    }
}
