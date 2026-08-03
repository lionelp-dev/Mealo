<?php

namespace App\Http\Controllers;

use App\Actions\ShoppingList\ShoppingListUpdateCheckedItemsAction;
use App\Actions\Workspace\WorkspaceGetCurrentAction;
use App\Data\Requests\ShoppingList\ShoppingListIndexRequestData;
use App\Data\Requests\ShoppingList\ShoppingListToggleIngredientRequestData;
use App\Data\Requests\ShoppingList\ShoppingListUpdateRequestData;
use App\Data\Resources\ShoppingList\ShoppingListResourceData;
use App\Data\Resources\Workspace\Entities\WorkspaceInvitationResourceData;
use App\Data\Resources\Workspace\Entities\WorkspaceResourceData;
use App\Http\Controllers\Concerns\HasAuthenticatedUser;
use App\Messages\ShoppingList\ShoppingListIngredientUpdatedMessage;
use App\Models\ShoppingList;
use App\Models\ShoppingListPlannedMealIngredient;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ShoppingListController extends Controller
{
    use HasAuthenticatedUser;

    /**
     * Display the shopping list for a specific week
     */
    public function index(
        WorkspaceGetCurrentAction $getCurrentWorkspaceAction,
        ShoppingListIndexRequestData $shoppingListIndexRequestData
    ): Response {
        $weekStart = $shoppingListIndexRequestData->week
            ? Carbon::parse($shoppingListIndexRequestData->week)->startOfWeek()
            : Carbon::now()->startOfWeek();

        $currentWorkspace = $getCurrentWorkspaceAction($this->authenticatedUser());

        $shoppingList = ShoppingList::query()
            ->where('workspace_id', $currentWorkspace->id)
            ->whereDate('week_start', $weekStart)
            ->with('plannedMealIngredients')
            ->first();

        return Inertia::render('shopping-lists/index', [
            'weekStart' => $weekStart->toDateString(),
            'workspace_data' => [
                'current_workspace' => WorkspaceResourceData::from($currentWorkspace),
                'workspaces' => WorkspaceResourceData::collect($this->authenticatedUser()->workspaces),
                'pending_invitations' => WorkspaceInvitationResourceData::collect($this->authenticatedUser()->workspacesInvitations()
                    ->where('expires_at', '>', now())
                    ->with(['workspace', 'invitedBy'])
                    ->get()),
            ],
            'shopping_list_data' => $shoppingList ? ShoppingListResourceData::from($shoppingList) : [],
        ]);
    }

    public function update(
        ShoppingListUpdateRequestData $shoppingListUpdateRequestData,
        WorkspaceGetCurrentAction $getCurrentWorkspaceAction,
        ShoppingListUpdateCheckedItemsAction $updateCheckedItemsAction
    ): RedirectResponse {
        try {
            $currentWorkspace = $getCurrentWorkspaceAction($this->authenticatedUser());

            $updateCheckedItemsAction->execute(
                $this->authenticatedUser(),
                $currentWorkspace,
                $shoppingListUpdateRequestData
            );

            return back()->with('success', ShoppingListIngredientUpdatedMessage::message());
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Toggle the checked status of a shopping list ingredient
     */
    public function toggleIngredient(
        ShoppingListToggleIngredientRequestData $shoppingListToggleIngredientRequestData,
        ShoppingListPlannedMealIngredient $ingredient
    ): RedirectResponse {
        try {
            Gate::authorize('update', $ingredient->shoppingList);

            $ingredient->is_checked = $shoppingListToggleIngredientRequestData->is_checked;

            $ingredient->save();

            return back()->with('success', ShoppingListIngredientUpdatedMessage::message());
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
