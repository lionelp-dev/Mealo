<?php

namespace App\Actions\ShoppingList;

use App\Data\Requests\ShoppingList\ShoppingListUpdateRequestData;
use App\Exceptions\ShoppingList\ShoppingListUpdateAuthorizationException;
use App\Models\ShoppingListPlannedMealIngredient;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class ShoppingListUpdateCheckedItemsAction
{
    public function execute(
        User $user,
        Workspace $currentWorkspace,
        ShoppingListUpdateRequestData $shoppingListUpdateRequestData
    ): void {
        $authorizedShoppingListIds = [];

        DB::transaction(function () use ($user, $currentWorkspace, $shoppingListUpdateRequestData, &$authorizedShoppingListIds): void {
            foreach ($shoppingListUpdateRequestData->shopping_list_planned_meal_ingredients as $plannedMealIngredient) {
                $shoppingListIngredient = ShoppingListPlannedMealIngredient::query()
                    ->with('shoppingList.workspace')
                    ->where('shopping_list_id', $plannedMealIngredient->shopping_list_id)
                    ->where('planned_meal_id', $plannedMealIngredient->planned_meal_id)
                    ->where('ingredient_id', $plannedMealIngredient->ingredient_id)
                    ->firstOrFail();

                $shoppingList = $shoppingListIngredient->shoppingList;

                if (! $shoppingList || $shoppingList->workspace_id !== $currentWorkspace->id) {
                    throw new ShoppingListUpdateAuthorizationException;
                }

                if (! in_array($shoppingList->id, $authorizedShoppingListIds, true)) {
                    Gate::forUser($user)->authorize('update', $shoppingList);
                    $authorizedShoppingListIds[] = $shoppingList->id;
                }

                $shoppingListIngredient->is_checked = $plannedMealIngredient->is_checked;
                $shoppingListIngredient->save();
            }
        });
    }
}
