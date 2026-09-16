<?php

namespace App\Actions\PlannedMeal;

use App\Data\Requests\PlannedMeal\PlannedMealGeneratePlanRequestData;
use App\Enums\MealTimeEnum;
use App\Models\MealTime;
use App\Models\PlannedMeal;
use App\Models\Recipe;
use App\Models\User;
use App\Models\Workspace;
use Carbon\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

/**
 * @phpstan-type FormattedRecipe array{id: string, name: string, mealTimeIds: list<int>, ingredients: list<array{id: int}>}
 * @phpstan-type MealTimeConfiguration array{name: string, distribution: list<int>}
 * @phpstan-type MealPlan list<FormattedRecipe>
 * @phpstan-type MealPlanCandidates array<int, list<MealPlan>>
 * @phpstan-type PlannedMealEntry array{recipe_id: string, meal_time_id: int, planned_date: string, serving_size: int}
 * @phpstan-type DateRange array{start: Carbon, end: Carbon, numberOfDays: int}
 */
class PlannedMealGeneratePlanAction
{
    private const RECIPE_BATCH_SIZE = 25;

    private const MAX_CANDIDATES = 5;

    private const DEFAULT_DISTRIBUTION = [3, 2, 2];

    // Orchestration

    /**
     * Génère un planning complet et remplace les repas existants dans la période demandée.
     */
    public function execute(
        User $user,
        Workspace $workspace,
        PlannedMealGeneratePlanRequestData $requestData,
    ): int {
        $dateRange = $this->parseAndValidateDateRange($requestData);
        $recipes = $this->sampleUserRecipes(
            $user,
            $workspace,
            $dateRange['start'],
            $requestData->variant,
        );

        if ($recipes === []) {
            return 0;
        }

        $candidatePlans = $this->generateMealTimePlanCandidates(
            $recipes,
            $this->loadMealTimeIds(),
            $this->resolveMealTimeConfigurations($requestData),
            $requestData->maxSimilarity,
            $dateRange['numberOfDays'],
        );
        $mealPlans = $this->selectMealPlansWithFewestGlobalIngredients($candidatePlans);
        $entries = $this->mapMealPlansToPlannedMealEntries(
            $dateRange['start'],
            $mealPlans,
            $requestData->serving_size,
        );

        return $this->replacePlannedMealsInDateRange($user, $workspace, $dateRange, $entries);
    }

    // Input preparation

    /**
     * Parse et valide les dates demandées, puis calcule le nombre de jours inclus.
     *
     * @return DateRange
     */
    private function parseAndValidateDateRange(PlannedMealGeneratePlanRequestData $requestData): array
    {
        $startDate = Carbon::parse($requestData->startDate)->startOfDay();
        $endDate = Carbon::parse($requestData->endDate)->startOfDay();

        if ($endDate->lt($startDate)) {
            throw new InvalidArgumentException('The end date must be on or after the start date.');
        }

        return [
            'start' => $startDate,
            'end' => $endDate,
            'numberOfDays' => (int) $startDate->diffInDays($endDate) + 1,
        ];
    }

    /**
     * Normalise les configurations de types de repas et applique la distribution par défaut.
     *
     * @return list<MealTimeConfiguration>
     */
    private function resolveMealTimeConfigurations(PlannedMealGeneratePlanRequestData $requestData): array
    {
        if ($requestData->meal_times === []) {
            return array_map(
                fn (string $name): array => ['name' => $name, 'distribution' => self::DEFAULT_DISTRIBUTION],
                MealTimeEnum::values(),
            );
        }

        return array_values(array_filter(array_map(
            fn ($meal): ?array => $meal->name !== '' && $meal->distribution !== []
                ? ['name' => $meal->name, 'distribution' => array_values($meal->distribution)]
                : null,
            $requestData->meal_times,
        )));
    }

    // Recipe preparation

    /**
     * Sélectionne un échantillon déterministe de recettes appartenant à l'utilisateur.
     *
     * @return list<FormattedRecipe>
     */
    private function sampleUserRecipes(
        User $user,
        Workspace $workspace,
        Carbon $startDate,
        ?int $variant,
    ): array {
        // Random variant by default -> a different plan on every call; an explicit
        // variant makes the result fully reproducible.
        $variant ??= random_int(0, 2147483647);
        $seedHash = crc32("{$workspace->id}:{$user->id}:{$startDate->toDateString()}:{$variant}");

        // Deterministic DB-side seeded sampling. The random-order expression is driver-specific:
        // SQLite uses `rowid`; PostgreSQL hashes the UUID `id` (it can't be multiplied directly).
        $connection = Config::string('database.default');
        $driver = Config::string("database.connections.{$connection}.driver");

        $randomOrder = match ($driver) {
            'sqlite' => '((rowid * ?) % 2147483647) ASC',
            'pgsql' => '((hashtext(id::text)::bigint * ?) % 2147483647) ASC',
            default => throw new \RuntimeException("Unsupported database driver for recipe sampling: {$driver}"),
        };

        return $this->mapRecipesToPlanningData(
            Recipe::query()
                ->where('user_id', $user->id)
                ->with(['ingredients', 'steps', 'tags', 'mealTimes'])
                ->orderByRaw($randomOrder, [$seedHash])
                ->limit(self::RECIPE_BATCH_SIZE)
                ->get()
        );
    }

    /**
     * Convertit les modèles de recettes en données minimales utilisables par l'algorithme.
     *
     * @param  \Illuminate\Support\Collection<int, Recipe>  $recipes
     * @return list<FormattedRecipe>
     */
    private function mapRecipesToPlanningData(\Illuminate\Support\Collection $recipes): array
    {
        $formatted = [];
        foreach ($recipes as $recipe) {
            $ingredients = [];
            foreach ($recipe->ingredients as $ingredient) {
                $ingredients[] = ['id' => (int) $ingredient->id];
            }

            $mealTimeIds = [];
            foreach ($recipe->mealTimes as $mealTime) {
                $mealTimeIds[] = (int) $mealTime->id;
            }

            $formatted[] = [
                'id' => $recipe->id,
                'name' => $recipe->name,
                'mealTimeIds' => $mealTimeIds,
                'ingredients' => $ingredients,
            ];
        }

        return $formatted;
    }

    /**
     * Charge les identifiants des types de repas indexés par leur slug.
     *
     * @return array<string, int>
     */
    private function loadMealTimeIds(): array
    {
        $mealTimeIds = [];
        foreach (MealTime::query()->pluck('id', 'slug')->all() as $slug => $id) {
            if (! is_int($id) && ! is_numeric($id)) {
                continue;
            }

            $mealTimeIds[(string) $slug] = (int) $id;
        }

        return $mealTimeIds;
    }

    /**
     * Recherche l'identifiant d'un type de repas à partir de son nom ou slug.
     *
     * @param  array<string, int>  $mealTimeIds
     */
    private function findMealTimeIdByName(string $name, array $mealTimeIds): ?int
    {
        return $mealTimeIds[$name] ?? null;
    }

    /**
     * Conserve uniquement les recettes associées au type de repas demandé.
     *
     * @param  list<FormattedRecipe>  $recipes
     * @return list<FormattedRecipe>
     */
    private function filterRecipesForMealTime(array $recipes, int $mealTimeId): array
    {
        return array_values(array_filter(
            $recipes,
            fn (array $recipe): bool => in_array($mealTimeId, $recipe['mealTimeIds'], true),
        ));
    }

    // Candidate plan generation

    /**
     * Génère les plans candidats pour chaque type de repas configuré.
     *
     * @param  list<FormattedRecipe>  $recipes
     * @param  array<string, int>  $mealTimeIds
     * @param  list<MealTimeConfiguration>  $mealTimeConfigurations
     * @return MealPlanCandidates
     */
    private function generateMealTimePlanCandidates(
        array $recipes,
        array $mealTimeIds,
        array $mealTimeConfigurations,
        float $maxSimilarity,
        int $numberOfDays,
    ): array {
        $candidatePlans = [];

        foreach ($mealTimeConfigurations as $configuration) {
            $mealTimeId = $this->findMealTimeIdByName($configuration['name'], $mealTimeIds);
            if ($mealTimeId === null) {
                continue;
            }

            $recipePool = $this->filterRecipesForMealTime($recipes, $mealTimeId);
            if ($recipePool === []) {
                continue;
            }

            $candidates = $this->createCandidateMealPlans(
                $recipePool,
                $configuration['distribution'],
                $maxSimilarity,
                $numberOfDays,
            );

            if ($candidates === []) {
                continue;
            }

            $candidatePlans[$mealTimeId] = $candidates;
        }

        return $candidatePlans;
    }

    /**
     * Construit plusieurs plans candidats en partant de recettes différentes.
     *
     * @param  list<FormattedRecipe>  $recipePool
     * @param  list<int>  $distribution
     * @return list<MealPlan>
     */
    private function createCandidateMealPlans(
        array $recipePool,
        array $distribution,
        float $maxSimilarity,
        int $numberOfDays,
    ): array {
        $candidates = [];
        $numberOfCandidates = min(self::MAX_CANDIDATES, count($recipePool));

        for ($index = 0; $index < $numberOfCandidates; $index++) {
            $candidates[] = $this->buildCandidateMealPlan(
                $recipePool,
                $distribution,
                $maxSimilarity,
                $recipePool[$index],
                $numberOfDays,
            );
        }

        return $candidates;
    }

    /**
     * Construit un plan candidat en respectant la distribution et la durée demandées.
     *
     * @param  list<FormattedRecipe>  $recipes
     * @param  list<int>  $distribution
     * @param  FormattedRecipe  $startRecipe
     * @return MealPlan
     */
    private function buildCandidateMealPlan(
        array $recipes,
        array $distribution,
        float $maxSimilarity,
        array $startRecipe,
        int $targetDays,
    ): array {
        $count = count($recipes);

        /** @var MealPlan $plan */
        $plan = [];

        $startIndex = 0;
        foreach ($recipes as $index => $recipe) {
            if ($recipe['id'] === $startRecipe['id']) {
                $startIndex = $index;
                break;
            }
        }

        if ($targetDays < 1) {
            return $plan;
        }

        $distributionIndex = 0;
        $recipeOffset = 0;
        while (count($plan) < $targetDays) {
            $days = $distribution[$distributionIndex % count($distribution)];
            $recipe = $recipes[($startIndex + $recipeOffset) % $count];

            if ($plan !== []) {
                $last = $plan[count($plan) - 1];
                $attempts = 0;
                while ($attempts < $count && $this->recipesExceedSimilarityThreshold($recipe, $last, $maxSimilarity)) {
                    $recipeOffset++;
                    $recipe = $recipes[($startIndex + $recipeOffset) % $count];
                    $attempts++;
                }
            }

            $daysToAdd = min($days, $targetDays - count($plan));
            for ($j = 0; $j < $daysToAdd; $j++) {
                $plan[] = $recipe;
            }

            $distributionIndex++;
            $recipeOffset++;
        }

        return $plan;
    }

    /**
     * Indique si deux recettes dépassent le seuil de similarité autorisé.
     *
     * @param  FormattedRecipe  $recipe1
     * @param  FormattedRecipe  $recipe2
     */
    private function recipesExceedSimilarityThreshold(array $recipe1, array $recipe2, float $threshold): bool
    {
        $ids2 = array_column($recipe2['ingredients'], 'id');

        $common = 0;
        foreach ($recipe1['ingredients'] as $ingredient) {
            if (in_array($ingredient['id'], $ids2, true)) {
                $common++;
            }
        }

        $min = min(count($recipe1['ingredients']), count($recipe2['ingredients']));
        if ($min === 0) {
            return false;
        }

        return $common / $min > $threshold;
    }

    // Global plan selection

    /**
     * Sélectionne la combinaison de plans dont l'ensemble global contient le moins d'ingrédients.
     *
     * @param  MealPlanCandidates  $candidatePlans
     * @return array<int, MealPlan>
     */
    private function selectMealPlansWithFewestGlobalIngredients(array $candidatePlans): array
    {
        if ($candidatePlans === []) {
            return [];
        }

        $mealTimeIds = array_keys($candidatePlans);
        $bestPlans = [];
        $bestScore = PHP_INT_MAX;

        $this->evaluateMealPlanCombinations(
            $candidatePlans,
            $mealTimeIds,
            0,
            [],
            $bestPlans,
            $bestScore,
        );

        return $bestPlans;
    }

    /**
     * Parcourt récursivement toutes les combinaisons de plans candidats et conserve la meilleure.
     *
     * @param  MealPlanCandidates  $candidatePlans
     * @param  list<int>  $mealTimeIds
     * @param  array<int, MealPlan>  $selectedPlans
     * @param  array<int, MealPlan>  $bestPlans
     */
    private function evaluateMealPlanCombinations(
        array $candidatePlans,
        array $mealTimeIds,
        int $mealTimeIndex,
        array $selectedPlans,
        array &$bestPlans,
        int &$bestScore,
    ): void {
        if ($mealTimeIndex === count($mealTimeIds)) {
            $score = $this->countUniqueIngredientsAcrossMealPlans($selectedPlans);
            if ($score < $bestScore) {
                $bestPlans = $selectedPlans;
                $bestScore = $score;
            }

            return;
        }

        $mealTimeId = $mealTimeIds[$mealTimeIndex];
        foreach ($candidatePlans[$mealTimeId] as $candidate) {
            $selectedPlans[$mealTimeId] = $candidate;
            $this->evaluateMealPlanCombinations(
                $candidatePlans,
                $mealTimeIds,
                $mealTimeIndex + 1,
                $selectedPlans,
                $bestPlans,
                $bestScore,
            );
        }
    }

    /**
     * Compte les ingrédients uniques utilisés par l'ensemble des types de repas.
     *
     * @param  array<int, MealPlan>  $mealPlans
     */
    private function countUniqueIngredientsAcrossMealPlans(array $mealPlans): int
    {
        $ids = [];
        foreach ($mealPlans as $mealPlan) {
            foreach ($mealPlan as $recipe) {
                foreach ($recipe['ingredients'] as $ingredient) {
                    $ids[$ingredient['id']] = true;
                }
            }
        }

        return count($ids);
    }

    // Persistence

    /**
     * Transforme les plans sélectionnés en entrées prêtes à être persistées.
     *
     * @param  array<int, MealPlan>  $mealPlans
     * @return list<PlannedMealEntry>
     */
    private function mapMealPlansToPlannedMealEntries(Carbon $startDate, array $mealPlans, int $servingSize): array
    {
        $entries = [];
        foreach ($mealPlans as $mealTimeId => $plan) {
            foreach ($plan as $index => $recipe) {
                $entries[] = [
                    'recipe_id' => $recipe['id'],
                    'meal_time_id' => $mealTimeId,
                    'planned_date' => $startDate->copy()->addDays($index)->toDateString(),
                    'serving_size' => $servingSize,
                ];
            }
        }

        usort($entries, fn (array $a, array $b): int => [$a['planned_date'], $a['meal_time_id']] <=> [$b['planned_date'], $b['meal_time_id']]);

        return $entries;
    }

    /**
     * Supprime puis recrée les repas planifiés dans une transaction et dans le range demandé.
     *
     * @param  DateRange  $dateRange
     * @param  list<PlannedMealEntry>  $entries
     */
    private function replacePlannedMealsInDateRange(
        User $user,
        Workspace $workspace,
        array $dateRange,
        array $entries,
    ): int {
        return DB::transaction(function () use ($user, $workspace, $dateRange, $entries): int {
            PlannedMeal::query()
                ->where('user_id', $user->id)
                ->where('workspace_id', $workspace->id)
                ->whereDate('planned_date', '>=', $dateRange['start']->toDateString())
                ->whereDate('planned_date', '<=', $dateRange['end']->toDateString())
                ->delete();

            foreach ($entries as $entry) {
                PlannedMeal::query()->create([
                    'workspace_id' => $workspace->id,
                    'user_id' => $user->id,
                    'recipe_id' => $entry['recipe_id'],
                    'meal_time_id' => $entry['meal_time_id'],
                    'planned_date' => $entry['planned_date'],
                    'serving_size' => $entry['serving_size'],
                ]);
            }

            return count($entries);
        });
    }
}
