<?php

namespace App\Http\Controllers;

use App\Http\Resources\ShoppingListResource;
use App\Models\ShoppingListIngredient;
use App\Models\WorkspaceInvitation;
use App\Services\ShoppingListService;
use App\Services\WorkspaceDataService;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ShoppingListController extends Controller
{
    public function __construct(
        private ShoppingListService $shoppingListService,
        private WorkspaceDataService $workspaceDataService
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

        $user = $request->user();

        $workspaceData = $this->workspaceDataService->getWorkspaceDataForUser($user);
        $currentWorkspace = $workspaceData['current_workspace'];

        $shoppingList = $this->shoppingListService->getShoppingListForWorkspace(
            $currentWorkspace->id,
            $weekStart
        );

        return Inertia::render('shopping-lists/index', [
            'shoppingList' => $shoppingList ? new ShoppingListResource($shoppingList) : null,
            'weekStart' => $weekStart->toDateString(),
            'workspace_data' => $workspaceData,
        ]);
    }

    /**
     * Toggle the checked status of a shopping list ingredient
     */
    public function toggleIngredient(Request $request, ShoppingListIngredient $ingredient)
    {
        try {
            Gate::authorize('update', $ingredient->shoppingList);
        } catch (Exception $e) {
            return back()->with('error', 'This action is unauthorized');
        }

        $validated = $request->validate([
            'is_checked' => ['required', 'boolean'],
        ]);

        $success = $this->shoppingListService->toggleIngredientChecked(
            $ingredient->id,
            $validated['is_checked']
        );

        if ($success) {
            return back()->with('success', 'Ingredient updated successfully');
        }

        return response()->json(['error' => 'Failed to update ingredient'], 500);
    }
}
