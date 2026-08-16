<?php

namespace App\Ai\Agents;

use App\Enums\Unit;
use App\Models\MealTime;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\JsonSchemaTypeFactory;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Contracts\HasStructuredOutput;
use Laravel\Ai\Contracts\HasTools;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Messages\Message;
use Laravel\Ai\Promptable;
use Stringable;

class RecipeGenerator implements Agent, Conversational, HasStructuredOutput, HasTools
{
    use Promptable;

    private string $mealTimes;

    private string $units;

    public function __construct()
    {
        try {
            $mealTimes = MealTime::all();
            $this->mealTimes = json_encode(
                $mealTimes->map(fn (MealTime $mt) => [
                    'id' => $mt->id,
                    'name' => $mt->name,
                ])->toArray(),
                JSON_THROW_ON_ERROR
            );
        } catch (\JsonException) {
            $this->mealTimes = '';
        }

        try {
            $this->units = json_encode(
                Unit::values(),
                JSON_THROW_ON_ERROR
            );
        } catch (\JsonException) {
            $this->units = '';
        }
    }

    /**
     * Get the instructions that the agent should follow.
     */
    public function instructions(): Stringable|string
    {
        return "
            Tu es un chef cuisinier expert. À partir du prompt de l'utilisateur, tu dois créer une recette complète et détaillée.

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
            Utilise UNIQUEMENT ces unités (format exact) : {$this->units}

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
            Choisir tous les moments appropriés (ex: omelette -> breakfast, brunch, lunch)
        ";
    }

    /**
     * Get the list of messages comprising the conversation so far.
     *
     * @return Message[]
     */
    public function messages(): iterable
    {
        return [];
    }

    /**
     * Get the tools available to the agent.
     *
     * @return Tool[]
     */
    public function tools(): iterable
    {
        return [];
    }

    /**
     * Get the agent's structured output schema definition.
     */
    public function schema(JsonSchema $schema): array
    {
        assert($schema instanceof JsonSchemaTypeFactory);

        return [
            'name' => $schema->string()
                ->description('Recipe name')
                ->required(),
            'description' => $schema->string()
                ->description('Recipe description (max 500 characters). Be concise but descriptive.')
                ->max(500)
                ->required(),
            'preparation_time' => $schema->integer()
                ->description('Preparation time in minutes')
                ->min(5)
                ->max(120)
                ->required(),
            'cooking_time' => $schema->integer()
                ->description('Cooking time in minutes')
                ->min(0)
                ->max(240)
                ->required(),
            'serving_size' => $schema->integer()
                ->description('Number of servings this recipe makes (1-50)')
                ->min(1)
                ->max(50)
                ->required(),
            'meal_times' => $schema->array()
                ->description("Types of meals. You can choose one or multiple meal times from this exact list: {$this->mealTimes}")
                ->items($schema->object([
                    'id' => $schema->integer()
                        ->description('Meal time ID')
                        ->required(),
                    'name' => $schema->string()
                        ->description('Meal time name')
                        ->required(),
                ]))
                ->min(1)
                ->max(4)
                ->required(),
            'tags' => $schema->array()
                ->description('Descriptive tags for the recipe')
                ->items($schema->object([
                    'name' => $schema->string()
                        ->description('Tag name')
                        ->required(),
                ]))
                ->min(1)
                ->required(),
            'ingredients' => $schema->array()
                ->description('List of ingredients')
                ->items($schema->object([
                    'name' => $schema->string()
                        ->description('Ingredient name')
                        ->required(),
                    'quantity' => $schema->number()
                        ->description('Ingredient quantity as number')
                        ->min(0)
                        ->required(),
                    'unit' => $schema->string()
                        ->description("Ingredient unit. You can choose one from this exact list: {$this->units}")
                        ->enum(Unit::values())
                        ->required(),
                ]))
                ->min(1)
                ->required(),
            'steps' => $schema->array()
                ->description('Cooking steps in sequential order. Each step MUST have both description and order fields.')
                ->items($schema->object([
                    'order' => $schema->integer()
                        ->description('Step order number (starting from 1, sequential)')
                        ->min(1)
                        ->required(),
                    'description' => $schema->string()
                        ->description('Step description (max 255 characters)')
                        ->max(255)
                        ->required(),
                ]))
                ->min(1)
                ->required(),
        ];
    }
}
