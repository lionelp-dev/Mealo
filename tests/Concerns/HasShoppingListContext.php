<?php

namespace Tests\Concerns;

use App\Models\ShoppingList;
use App\Models\Workspace;
use Carbon\Carbon;
use Carbon\CarbonInterface;

trait HasShoppingListContext
{
    public function findShoppingListForWorkspaceAndDate(
        Workspace $workspace,
        CarbonInterface|string $date,
    ): ShoppingList {
        $weekStart = Carbon::parse($date)->startOfWeek();

        return ShoppingList::query()
            ->where('workspace_id', $workspace->id)
            ->whereDate('week_start', $weekStart->toDateString())
            ->firstOrFail();
    }
}
