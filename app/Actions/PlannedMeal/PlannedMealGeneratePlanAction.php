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

/**
 * Local, algorithmic meal-plan generator (PHP port of the TS `MealPlanner`).
 *
 * Loads the user's recipes, builds per-meal-time plans honoring a repetition distribution
 * while avoiding ingredient-similar recipes back-to-back, then persists the planned meals.
 *
 * @phpstan-type FormattedRecipe array{id: string, name: string, mealTimeIds: list<int>, ingredients: list<array{id: int}>}
 */
class PlannedMealGeneratePlanAction
{
    private const RECIPE_BATCH_SIZE = 25;

    private const MAX_CANDIDATES = 5;

    private const DEFAULT_DISTRIBUTION = [3, 2, 2];

    public function execute(
        User $user,
        Workspace $workspace,
        PlannedMealGeneratePlanRequestData $requestData,
    ): int {
        $startDate = Carbon::parse($requestData->startDate)->startOfDay();
        $endDate = Carbon::parse($requestData->endDate)->startOfDay();

        // Random variant by default -> a different plan on every call; an explicit
        // variant makes the result fully reproducible.
        $variant = $requestData->variant ?? random_int(0, 2147483647);
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

        $recipes = $this->formatRecipes(
            Recipe::query()
                ->where('user_id', $user->id)
                ->with(['ingredients', 'steps', 'tags', 'mealTimes'])
                ->orderByRaw($randomOrder, [$seedHash])
                ->limit(self::RECIPE_BATCH_SIZE)
                ->get()
        );

        if ($recipes === []) {
            return 0;
        }

        /** @var array<string, int> $mealTimeIds */
        $mealTimeIds = MealTime::query()->pluck('id', 'name')->all();

        $mealPlans = [];
        foreach ($this->resolveMealTimes($requestData) as $meal) {
            $mealTimeId = $this->resolveMealTimeId($meal['name'], $mealTimeIds);
            if ($mealTimeId === null) {
                continue;
            }

            // Only plan recipes that actually belong to this meal time. The batch order
            // comes from the seeded orderByRaw query, so no in-memory shuffle is needed.
            $pool = array_values(array_filter(
                $recipes,
                fn (array $recipe): bool => in_array($mealTimeId, $recipe['mealTimeIds'], true),
            ));

            if ($pool === []) {
                continue;
            }

            $candidates = [];
            $numberOfCandidates = min(self::MAX_CANDIDATES, count($pool));
            for ($i = 0; $i < $numberOfCandidates; $i++) {
                $candidates[] = $this->buildMealPlan(
                    $pool,
                    $meal['distribution'],
                    $requestData->maxSimilarity,
                    $pool[$i],
                );
            }

            $mealPlans[$mealTimeId] = $this->bestCandidate($candidates);
        }

        $entries = $this->toDbEntries($startDate, $mealPlans, $requestData->serving_size);

        return $this->persist($user, $workspace, $startDate, $endDate, $entries);
    }

    /**
     * @param  \Illuminate\Support\Collection<int, Recipe>  $recipes
     * @return list<FormattedRecipe>
     */
    private function formatRecipes(\Illuminate\Support\Collection $recipes): array
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
     * Resolve the meal-time configs, defaulting to every meal time with the default distribution.
     *
     * @return list<array{name: string, distribution: list<int>}>
     */
    private function resolveMealTimes(PlannedMealGeneratePlanRequestData $requestData): array
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

    /**
     * Build a plan honoring the distribution EXACTLY (e.g. [3,2,2] -> 3 days A, 2 days B, 2 days C),
     * skipping ingredient-similar recipes back-to-back when possible.
     *
     * @param  list<FormattedRecipe>  $recipes
     * @param  list<int>  $distribution
     * @param  FormattedRecipe  $startRecipe
     * @return list<FormattedRecipe>
     */
    private function buildMealPlan(array $recipes, array $distribution, float $maxSimilarity, array $startRecipe): array
    {
        $count = count($recipes);
        $plan = [];

        $startIndex = 0;
        foreach ($recipes as $index => $recipe) {
            if ($recipe['id'] === $startRecipe['id']) {
                $startIndex = $index;
                break;
            }
        }

        foreach ($distribution as $i => $days) {
            $recipe = $recipes[($startIndex + $i) % $count];

            if ($plan !== []) {
                $last = $plan[count($plan) - 1];
                $attempts = 0;
                while ($attempts < $count && $this->areTooSimilar($recipe, $last, $maxSimilarity)) {
                    $offset = ($i + $attempts + 1) % $count;
                    $recipe = $recipes[($startIndex + $offset) % $count];
                    $attempts++;
                }
            }

            for ($j = 0; $j < $days; $j++) {
                $plan[] = $recipe;
            }
        }

        return $plan;
    }

    /**
     * @param  FormattedRecipe  $recipe1
     * @param  FormattedRecipe  $recipe2
     */
    private function areTooSimilar(array $recipe1, array $recipe2, float $threshold): bool
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

    /**
     * Keep the candidate plan with the fewest unique ingredients.
     *
     * @param  list<list<FormattedRecipe>>  $candidates
     * @return list<FormattedRecipe>
     */
    private function bestCandidate(array $candidates): array
    {
        $best = $candidates[0];
        $bestScore = $this->countUniqueIngredients($best);

        foreach ($candidates as $candidate) {
            $score = $this->countUniqueIngredients($candidate);
            if ($score < $bestScore) {
                $best = $candidate;
                $bestScore = $score;
            }
        }

        return $best;
    }

    /**
     * @param  list<FormattedRecipe>  $plan
     */
    private function countUniqueIngredients(array $plan): int
    {
        $ids = [];
        foreach ($plan as $recipe) {
            foreach ($recipe['ingredients'] as $ingredient) {
                $ids[$ingredient['id']] = true;
            }
        }

        return count($ids);
    }

    /**
     * @param  array<int, list<FormattedRecipe>>  $mealPlans
     * @return list<array{recipe_id: string, meal_time_id: int, planned_date: string, serving_size: int}>
     */
    private function toDbEntries(Carbon $startDate, array $mealPlans, int $servingSize): array
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
     * @param  array<string, int>  $mealTimeIds
     */
    private function resolveMealTimeId(string $name, array $mealTimeIds): ?int
    {
        return $mealTimeIds[$name] ?? null;
    }

    /**
     * @param  list<array{recipe_id: string, meal_time_id: int, planned_date: string, serving_size: int}>  $entries
     */
    private function persist(User $user, Workspace $workspace, Carbon $startDate, Carbon $endDate, array $entries): int
    {
        // Plan length is driven by the distribution (not endDate), so bound the delete on the
        // dates actually generated, falling back to the requested range when nothing was generated.
        $plannedDates = array_column($entries, 'planned_date');
        $deleteFrom = $plannedDates === [] ? $startDate->toDateString() : min($plannedDates);
        $deleteTo = $plannedDates === [] ? $endDate->toDateString() : max($plannedDates);

        return DB::transaction(function () use ($user, $workspace, $deleteFrom, $deleteTo, $entries): int {
            PlannedMeal::query()
                ->where('user_id', $user->id)
                ->where('workspace_id', $workspace->id)
                ->whereDate('planned_date', '>=', $deleteFrom)
                ->whereDate('planned_date', '<=', $deleteTo)
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
