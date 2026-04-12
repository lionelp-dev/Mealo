<?php

namespace App\Actions\Recipes;

use App\Data\Requests\Recipe\GenerateRecipeRequestData;
use App\Data\Requests\Recipe\StoreRecipeRequestData;
use App\Enums\Unit;
use App\Models\MealTime;
use Exception;

class GenerateRecipeWithAIAction
{
    private $client;

    private string $mealTimes;

    private string $units;

    public function __construct()
    {
        $this->client = app('openai.client');

        try {
            $mealTimes = MealTime::all();
            $this->mealTimes = json_encode(
                $mealTimes->map(fn ($mt) => [
                    'id' => $mt->id,
                    'name' => $mt->name,
                ])->toArray(),
                JSON_THROW_ON_ERROR
            );
        } catch (\JsonException $e) {
            $this->mealTimes = '';
        }

        try {
            $this->units = json_encode(
                Unit::values(),
                JSON_THROW_ON_ERROR
            );
        } catch (\JsonException $e) {
            $this->units = '';
        }
    }

    /**
     * @return array<int,array<string,string>>
     */
    private function buildMessages(GenerateRecipeRequestData $promptData): array
    {
        return [
            [
                'role' => 'system',
                'content' => "
                Tu es un chef cuisinier expert. À partir du prompt de l'utilisateur, tu dois créer une recette complète et détaillée en utilisant la fonction generate_recipe.
                CHAMPS REQUIS :
                - name: Nom de la recette
                - description: Description détaillée de la recette
                - preparation_time: Temps de préparation en minutes (entier)
                - cooking_time: Temps de cuisson en minutes (entier)
                - serving_size: Nombre de portions que produit cette recette (entre 1 et 50, choisis selon le type de plat et les quantités d'ingrédients)
                - meal_times: Types de repas appropriés. Choisis EXACTEMENT dans cette liste: {$this->mealTimes}
                - tags: Tags descriptifs (cuisine, difficulté, régime, etc.). Format: [{'name': 'tag1'}, {'name': 'tag2'}]
                - ingredients: Liste complète avec quantités précises et unités
                - steps: Étapes numérotées et détaillées

                 # CONTRAINTES STRICTES

                 ## Unités de Mesure
                 Utilisez UNIQUEMENT ces unités (format exact) : {$this->units}

                 Sélection par type d'ingrédient :
                 - Liquides : ml, l, cup, fl oz
                 - Solides : g, kg, oz, lb
                 - Épices : tsp, tbsp, pinch, dash
                 - Items comptables : piece, slice, clove
                 - Assaisonnement facultatif : to taste, as needed (avec parcimonie)

                 ## Temps Réalistes
                 - preparation_time : 5-120 min (découpe, mélange, assemblage)
                 - cooking_time : 0-240 min (cuisson, four, mijotage)
                 Exemples : salade = 15min prep / 0min cuisson, boeuf bourguignon = 30min prep / 180min cuisson

                 ## Portions (serving_size)
                 Choisir selon le type de plat :
                 - Plats principaux : 2-8 portions
                 - Desserts : 4-12 portions
                 - Apéritifs : 6-20 portions

                 ## Meal Times
                 Sélectionner parmi : {$this->mealTimes}
                 Choisir tous les moments appropriés (ex: omelette → breakfast, brunch, lunch)",
            ],
            ['role' => 'user', 'content' => $promptData->prompt],
        ];
    }

    /**
     * @return array<string,mixed>
     */
    private function buildGenerateRecipeToolSchema(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'name' => [
                    'type' => 'string',
                    'description' => 'Recipe name',
                ],
                'description' => [
                    'type' => 'string',
                    'description' => 'Recipe description (max 255 characters)',
                    'maxLength' => 255,
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
                    'description' => "Types of meals. You can choose one or multiple meal times from this exact list: {$this->mealTimes}",
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
                                'description' => "Ingredient unit. You can choose one from this exact list: {$this->units}",
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
                                'description' => 'Step description (max 255 characters)',
                                'maxLength' => 255,
                            ],
                            'order' => [
                                'type' => 'integer',
                                'description' => 'Step order number',
                            ],
                        ],
                        'required' => ['description', 'order'],
                    ],
                ]],
            'required' => ['name', 'description', 'preparation_time', 'cooking_time', 'serving_size', 'meal_times', 'tags', 'ingredients', 'steps'],
        ];

    }

    /**
     * Generate a recipe using OpenAI function calling with just a promptData
     */
    public function execute(GenerateRecipeRequestData $promptData): StoreRecipeRequestData
    {
        try {
            $response = $this->client->chat()->create([
                'model' => 'gpt-4o-mini',
                'tools' => [
                    [
                        'type' => 'function',
                        'function' => [
                            'name' => 'generate_recipe',
                            'description' => 'Generate a complete recipe with ingredients and instructions',
                            'parameters' => $this->buildGenerateRecipeToolSchema(),
                        ],
                    ],
                ],
                'tool_choice' => ['type' => 'function', 'function' => ['name' => 'generate_recipe']],
                'messages' => $this->buildMessages($promptData),
            ]);

            if (isset($response->choices[0]->message->toolCalls)) {
                foreach ($response->choices[0]->message->toolCalls as $toolCall) {
                    if ($toolCall->function->name === 'generate_recipe') {
                        $args = json_decode($toolCall->function->arguments, true);

                        if (! is_array($args)) {
                            throw new Exception('Invalid JSON arguments from OpenAI response');
                        }

                        return StoreRecipeRequestData::validateAndCreate($args);
                    }
                }
            }

            throw new Exception('No valid recipe generated from OpenAI response');
        } catch (Exception $e) {
            throw new Exception('Failed to generate recipe: '.$e->getMessage());
        }
    }
}
