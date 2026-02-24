<?php

namespace App\Observers;

use App\Models\PlannedMeal;
use App\Services\ShoppingListService;

class PlannedMealObserver
{
    public function __construct(private ShoppingListService $shoppingListService) {}

    /**
     * Handle the PlannedMeal "created" event.
     */
    public function created(PlannedMeal $plannedMeal): void
    {
        $this->shoppingListService->sync($plannedMeal);
    }

    /**
     * Handle the PlannedMeal "updated" event.
     */
    public function updated(PlannedMeal $plannedMeal): void
    {
        $this->shoppingListService->sync($plannedMeal);
    }

    /**
     * Handle the PlannedMeal "deleted" event.
     */
    public function deleted(PlannedMeal $plannedMeal): void
    {
        $this->shoppingListService->sync($plannedMeal);
    }
}
