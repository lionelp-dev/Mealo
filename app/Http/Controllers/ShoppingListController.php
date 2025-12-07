<?php

namespace App\Http\Controllers;

use App\Http\Resources\ShoppingListResource;
use App\Models\ShoppingListIngredient;
use App\Services\ShoppingListService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ShoppingListController extends Controller
{
    public function __construct(
        private ShoppingListService $shoppingListService
    ) {}

    /**
     * Display the shopping list for a specific week
     */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'week' => ['nullable', 'date'],
        ]);

        $weekStart = ($validated['week'] ?? null)
            ? Carbon::parse($validated['week'])->startOfWeek()
            : $this->shoppingListService->getCurrentWeekStart();

        $shoppingList = $this->shoppingListService->getShoppingListForWeek(
            $request->user()->id,
            $weekStart
        );

        return Inertia::render('shopping-lists/index', [
            'shoppingList' => $shoppingList ? new ShoppingListResource($shoppingList) : null,
            'weekStart' => $weekStart->toDateString(),
        ]);
    }

    /**
     * Toggle the checked status of a shopping list ingredient
     */
    public function toggleIngredient(Request $request, ShoppingListIngredient $ingredient)
    {
        Gate::authorize('update', $ingredient->shoppingList);

        $validated = $request->validate([
            'is_checked' => ['required', 'boolean'],
        ]);

        $success = $this->shoppingListService->toggleIngredientChecked(
            $ingredient->id,
            $validated['is_checked']
        );

        if ($success) {
            return back()->with('success');
        }

        return response()->json(['error' => 'Failed to update ingredient'], 500);
    }
}
