<?php

namespace App\Services;

use App\Models\ShoppingList;
use App\Models\ShoppingListIngredient;
use App\Models\PlannedMeal;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ShoppingListService
{
    /**
     * Generate or update shopping list for a specific user and week
     */
    public function generateShoppingListForWeek(int $userId, Carbon $weekStart): ShoppingList
    {
        // Ensure we have the start of the week
        $weekStart = $weekStart->startOfWeek();
        $weekEnd = $weekStart->clone()->endOfWeek();

        // Find or create the shopping list for this week
        // First, try to find existing shopping list
        $shoppingList = ShoppingList::where('user_id', $userId)
            ->whereDate('week_start', $weekStart->toDateString())
            ->first();

        // If not found, create it
        if (!$shoppingList) {
            $shoppingList = ShoppingList::create([
                'user_id' => $userId,
                'week_start' => $weekStart->toDateString(),
            ]);
        }

        // Store current checked status before regeneration
        $checkedStatuses = $this->getCurrentCheckedStatuses($shoppingList);

        // Clear existing ingredients
        $shoppingList->ingredients()->delete();

        // Aggregate ingredients from all planned meals in the week
        $aggregatedIngredients = $this->getAggregatedIngredients($userId, $weekStart, $weekEnd);

        // Create new shopping list ingredients
        foreach ($aggregatedIngredients as $ingredientData) {
            // Check if this ingredient was previously checked
            $isChecked = isset($checkedStatuses[$ingredientData->ingredient_id][$ingredientData->unit]);

            ShoppingListIngredient::create([
                'shopping_list_id' => $shoppingList->id,
                'ingredient_id' => $ingredientData->ingredient_id,
                'quantity' => $ingredientData->total_quantity,
                'unit' => $ingredientData->unit,
                'is_checked' => $isChecked,
            ]);
        }

        return $shoppingList->load('ingredients');
    }

    /**
     * Get current checked status for all ingredients in a shopping list
     * Returns array keyed by ingredient_id then unit
     */
    private function getCurrentCheckedStatuses(ShoppingList $shoppingList): array
    {
        $statuses = [];

        foreach ($shoppingList->ingredients->where('is_checked', true) as $ingredient) {
            $statuses[$ingredient->ingredient_id][$ingredient->unit] = true;
        }

        return $statuses;
    }

    /**
     * Aggregate ingredients from planned meals using complex JOIN query
     */
    private function getAggregatedIngredients(int $userId, Carbon $weekStart, Carbon $weekEnd): \Illuminate\Support\Collection
    {
        return DB::table('planned_meals')
            ->join('recipes', 'planned_meals.recipe_id', '=', 'recipes.id')
            ->join('recipe_ingredient', 'recipes.id', '=', 'recipe_ingredient.recipe_id')
            ->join('ingredients', 'recipe_ingredient.ingredient_id', '=', 'ingredients.id')
            ->select(
                'ingredients.id as ingredient_id',
                'ingredients.name as ingredient_name',
                'recipe_ingredient.unit',
                DB::raw('SUM(CAST(recipe_ingredient.quantity AS DECIMAL(10,2))) as total_quantity')
            )
            ->where('planned_meals.user_id', $userId)
            ->whereBetween('planned_meals.planned_date', [
                $weekStart->toDateString(),
                $weekEnd->toDateString(),
            ])
            ->groupBy('ingredients.id', 'ingredients.name', 'recipe_ingredient.unit')
            ->orderBy('ingredients.name')
            ->orderBy('recipe_ingredient.unit')
            ->get();
    }

    /**
     * Get shopping list for a specific week
     */
    public function getShoppingListForWeek(int $userId, Carbon $weekStart): ?ShoppingList
    {
        $weekStart = $weekStart->startOfWeek();

        return ShoppingList::with('ingredientsWithDetails')
            ->where('user_id', $userId)
            ->whereDate('week_start', $weekStart->toDateString())
            ->first();
    }

    /**
     * Toggle the checked status of a shopping list ingredient
     */
    public function toggleIngredientChecked(int $ingredientId, bool $isChecked): bool
    {
        $ingredient = ShoppingListIngredient::find($ingredientId);

        if (!$ingredient) {
            return false;
        }

        $ingredient->is_checked = $isChecked;
        return $ingredient->save();
    }

    /**
     * Get the current week start date
     */
    public function getCurrentWeekStart(): Carbon
    {
        return Carbon::now()->startOfWeek();
    }

    /**
     * Regenerate shopping lists for all affected weeks when planned meals change
     */
    public function regenerateAffectedShoppingLists(int $userId, array $dates): void
    {
        $affectedWeeks = [];

        foreach ($dates as $date) {
            $weekStart = Carbon::parse($date)->startOfWeek();
            $weekKey = $weekStart->toDateString();
            $affectedWeeks[$weekKey] = $weekStart;
        }

        foreach ($affectedWeeks as $weekStart) {
            $this->generateShoppingListForWeek($userId, $weekStart);
        }
    }

    /**
     * Delete shopping lists that have no ingredients
     */
    public function cleanupEmptyShoppingLists(int $userId): void
    {
        ShoppingList::where('user_id', $userId)
            ->whereDoesntHave('ingredients')
            ->delete();
    }
}
