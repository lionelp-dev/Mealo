<?php

namespace App\Http\Controllers;

use App\Actions\Workspace\WorkspaceGetCurrentAction;
use App\Data\Resources\Workspace\Entities\WorkspaceInvitationResourceData;
use App\Data\Resources\Workspace\Entities\WorkspaceResourceData;
use App\Http\Resources\ShoppingListResource;
use App\Models\ShoppingList;
use App\Models\ShoppingListPlannedMealIngredient;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShoppingListController extends Controller
{
    public function __construct(
    ) {}

    /**
     * Display the shopping list for a specific week
     */
    public function index(Request $request, WorkspaceGetCurrentAction $getCurrentWorkspaceAction): Response
    {
        $validated = $request->validate([
            'week' => ['nullable', 'date'],
        ]);

        $weekStart = ($validated['week'] ?? null) ? Carbon::parse($validated['week'])->startOfWeek() : Carbon::now()->startOfWeek();

        $user = $request->user();

        $currentWorkspace = $getCurrentWorkspaceAction($user);

        $shoppingList = ShoppingList::query()
            ->where('workspace_id', $currentWorkspace->id)
            ->whereDate('week_start', $weekStart)
            ->with('plannedMealIngredients')
            ->first();

        $shoppingListData = $shoppingList ? new ShoppingListResource($shoppingList)->toArray($request) : [];

        return Inertia::render('shopping-lists/index', [
            'weekStart' => $weekStart->toDateString(),
            'workspace_data' => [
                'current_workspace' => WorkspaceResourceData::from($currentWorkspace),
                'workspaces' => WorkspaceResourceData::collect($user->workspaces),
                'pending_invitations' => WorkspaceInvitationResourceData::collect($user->workspacesInvitations()
                    ->where('expires_at', '>', now())
                    ->with(['workspace', 'invitedBy'])
                    ->get()),
            ],
            'shopping_list_data' => $shoppingListData,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {

        $validated = $request->validate([
            'shopping_list_planned_meal_ingredients' => ['required', 'array'],
            'shopping_list_planned_meal_ingredients.*.shopping_list_id' => ['required', 'integer'],
            'shopping_list_planned_meal_ingredients.*.planned_meal_id' => ['required', 'integer'],
            'shopping_list_planned_meal_ingredients.*.ingredient_id' => ['required', 'string'],
            'shopping_list_planned_meal_ingredients.*.is_checked' => ['required', 'boolean:strict'],
        ]);

        try {
            foreach ($validated['shopping_list_planned_meal_ingredients'] as $planned_meal_ingredient) {
                $shoppingListIngredient = ShoppingListPlannedMealIngredient::query()
                    ->where('shopping_list_id', $planned_meal_ingredient['shopping_list_id'])
                    ->where('planned_meal_id', $planned_meal_ingredient['planned_meal_id'])
                    ->where('ingredient_id', $planned_meal_ingredient['ingredient_id'])
                    ->firstOrFail();
                $shoppingListIngredient->is_checked = $planned_meal_ingredient['is_checked'];

                $shoppingListIngredient->save();
            }

        } catch (Exception $e) {
            return back()->with(['error' => 'Failed to update ingredient'], 500);
        }

        return back()->with('success', 'Ingredient updated successfully');
    }

    /**
     * Toggle the checked status of a shopping list ingredient
     */
    public function toggleIngredient(Request $request, ShoppingListPlannedMealIngredient $ingredient): RedirectResponse
    {
        $validated = $request->validate([
            'is_checked' => ['required', 'boolean:strict'],
        ]);

        try {
            $ingredient->is_checked = $validated['is_checked'];
            $ingredient->save();
        } catch (Exception $e) {
            return back()->with('error', 'This action is unauthorized');
        }

        return back()->with('success', 'Ingredient updated successfully');
    }
}
