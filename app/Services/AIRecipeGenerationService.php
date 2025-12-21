<?php

namespace App\Services;

use App\Models\MealTime;
use OpenAI;
use Exception;

class AIRecipeGenerationService
{
    private $client;

    public function __construct()
    {
        // Check if a mock client is available (for testing)
        if (app()->bound('openai.client')) {
            $this->client = app('openai.client');
            return;
        }

        $apiKey = getenv('OPEN_ROUTER_API_KEY');

        if ($apiKey) {
            $this->client = OpenAI::factory()
                ->withApiKey($apiKey)
                ->withBaseUri('https://openrouter.ai/api/v1')
                ->withHttpHeader('HTTP-Referer', 'http://localhost')
                ->withHttpHeader('X-Title', 'Meal Planner')
                ->make();
        }
    }

    /**
     * Generate a recipe using OpenAI function calling with just a prompt
     */
    public function generateRecipe(string $prompt): array
    {
        // Vérifier si la clé API existe
        $apiKey = getenv('OPEN_ROUTER_API_KEY');
        if (!$apiKey || empty($apiKey)) {
            throw new Exception('La génération de recettes par IA n\'est pas disponible pour le moment.');
        }

        // Get available meal times from database
        $mealTimes = MealTime::all();
        $availableMealTimes = $mealTimes->map(fn($mt) => ['id' => $mt->id, 'name' => $mt->name])->toArray();
        $mealTimeListForPrompt = json_encode($availableMealTimes);

        try {
            $response = $this->client->chat()->create([
                'model' => 'gpt-4o-mini',
                'tools' => [
                    [
                        'type' => 'function',
                        'function' => [
                            'name' => 'generate_recipe',
                            'description' => 'Generate a complete recipe with ingredients and instructions',
                            'parameters' => [
                                'type' => 'object',
                                'properties' => [
                                    'name' => [
                                        'type' => 'string',
                                        'description' => 'Recipe name',
                                    ],
                                    'description' => [
                                        'type' => 'string',
                                        'description' => 'Recipe description',
                                    ],
                                    'preparation_time' => [
                                        'type' => 'integer',
                                        'description' => 'Preparation time in minutes',
                                    ],
                                    'cooking_time' => [
                                        'type' => 'integer',
                                        'description' => 'Cooking time in minutes',
                                    ],
                                    'meal_times' => [
                                        'type' => 'array',
                                        'description' => "Types of meals. You can choose one or multiple meal times from this exact list: {$mealTimeListForPrompt}",
                                        'items' => [
                                            'type' => 'object',
                                            'properties' => [
                                                'id' => [
                                                    'type' => 'integer',
                                                    'description' => 'Meal time ID',
                                                ],
                                                'name' => [
                                                    'type' => 'string',
                                                    'description' => 'Meal time name',
                                                ],
                                            ],
                                            'required' => ['id', 'name'],
                                        ],
                                    ],
                                    'tags' => [
                                        'type' => 'array',
                                        'description' => 'Descriptive tags for the recipe',
                                        'items' => [
                                            'type' => 'object',
                                            'properties' => [
                                                'name' => [
                                                    'type' => 'string',
                                                    'description' => 'Tag name',
                                                ],
                                            ],
                                            'required' => ['name'],
                                        ],
                                    ],
                                    'ingredients' => [
                                        'type' => 'array',
                                        'description' => 'List of ingredients',
                                        'items' => [
                                            'type' => 'object',
                                            'properties' => [
                                                'name' => [
                                                    'type' => 'string',
                                                    'description' => 'Ingredient name',
                                                ],
                                                'quantity' => [
                                                    'type' => 'number',
                                                    'description' => 'Ingredient quantity as number',
                                                ],
                                                'unit' => [
                                                    'type' => 'string',
                                                    'description' => 'Ingredient unit',
                                                ],
                                            ],
                                            'required' => ['name', 'quantity', 'unit'],
                                        ],
                                    ],
                                    'steps' => [
                                        'type' => 'array',
                                        'description' => 'Cooking steps',
                                        'items' => [
                                            'type' => 'object',
                                            'properties' => [
                                                'description' => [
                                                    'type' => 'string',
                                                    'description' => 'Step description',
                                                ],
                                                'order' => [
                                                    'type' => 'integer',
                                                    'description' => 'Step order number',
                                                ],
                                            ],
                                            'required' => ['description', 'order'],
                                        ],
                                    ],
                                ],
                                'required' => ['name', 'description', 'preparation_time', 'cooking_time', 'meal_times', 'tags', 'ingredients', 'steps'],
                            ],
                        ],
                    ],
                ],
                'tool_choice' => ['type' => 'function', 'function' => ['name' => 'generate_recipe']],
                'messages' => [
                    ['role' => 'system', 'content' => "Tu es un chef cuisinier expert. À partir du prompt de l'utilisateur, tu dois créer une recette complète et détaillée en utilisant la fonction generate_recipe.

CHAMPS REQUIS :
- name: Nom de la recette
- description: Description détaillée de la recette
- preparation_time: Temps de préparation en minutes (entier)
- cooking_time: Temps de cuisson en minutes (entier)
- meal_times: Types de repas appropriés. Choisis EXACTEMENT dans cette liste: {$mealTimeListForPrompt}
- tags: Tags descriptifs (cuisine, difficulté, régime, etc.). Format: [{'name': 'tag1'}, {'name': 'tag2'}]
- ingredients: Liste complète avec quantités précises et unités
- steps: Étapes numérotées et détaillées

IMPORTANT :
- Chaque ingrédient doit avoir une quantité précise (jamais vide) et une unité de mesure
- Pour les assaisonnements comme sel, poivre, utilisez des quantités comme '1' avec des unités comme 'pincée', 'cuillère à café', etc.
- Les temps doivent être réalistes et en entiers
- Choisis les meal_times appropriés selon le type de plat"],
                    ['role' => 'user', 'content' => $prompt],
                ],
            ]);

            // Parse the function calling response (for real OpenAI API)
            if (isset($response->choices[0]->message->toolCalls)) {
                foreach ($response->choices[0]->message->toolCalls as $toolCall) {
                    if ($toolCall->function->name === 'generate_recipe') {
                        $args = json_decode($toolCall->function->arguments, true);
                        return $args;
                    }
                }
            }

            // For backward compatibility with mocked responses that have content instead of toolCalls
            if (isset($response->choices[0]->message->content)) {
                $content = $response->choices[0]->message->content;
                if (is_string($content)) {
                    $data = json_decode($content, true);
                    if ($data) {
                        return $data;
                    }
                }
            }

            throw new Exception('No valid recipe generated from OpenAI response');

        } catch (Exception $e) {
            throw new Exception('Failed to generate recipe: ' . $e->getMessage());
        }
    }

}
