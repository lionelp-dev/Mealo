<?php

namespace App\Observers;

use App\Actions\ShoppingList\ShoppingListSyncAction;
use App\Models\PlannedMeal;

class PlannedMealObserver
{
    public function __construct(private ShoppingListSyncAction $syncShoppingList) {}

    /**
     * Handle the PlannedMeal "created" event.
     */
    public function created(PlannedMeal $plannedMeal): void
    {
        ($this->syncShoppingList)($plannedMeal);
    }

    /**
     * Handle the PlannedMeal "updated" event.
     */
    public function updated(PlannedMeal $plannedMeal): void
    {
        ($this->syncShoppingList)($plannedMeal);
    }

    /**
     * Handle the PlannedMeal "deleted" event.
     */
    public function deleted(PlannedMeal $plannedMeal): void
    {
        ($this->syncShoppingList)($plannedMeal);
    }
}
