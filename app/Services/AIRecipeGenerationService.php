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
        $this->client = app('openai.client');
    }

    /**
     * Generate a recipe using OpenAI function calling with just a prompt
     */
    public function generateRecipe(string $prompt): array
    {

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
                                    'serving_size' => [
                                        'type' => 'integer',
                                        'description' => 'Number of servings this recipe makes (1-50)',
                                        'minimum' => 1,
                                        'maximum' => 50,
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
                                'required' => ['name', 'description', 'preparation_time', 'cooking_time', 'serving_size', 'meal_times', 'tags', 'ingredients', 'steps'],
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
- serving_size: Nombre de portions que produit cette recette (entre 1 et 50, choisis selon le type de plat et les quantités d'ingrédients)
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
