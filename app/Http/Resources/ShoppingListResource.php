<?php

namespace App\Http\Resources;

use App\Services\ShoppingListService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShoppingListResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $shoppingListService = app(ShoppingListService::class);

        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'workspace_id' => $this->workspace_id,
            'week_start' => $this->week_start->toDateString(),
            'by_ingredients' => $shoppingListService->getAggregatedIngredients($this->resource),
            'by_recipes' => $shoppingListService->getIngredientsGroupedByRecipe($this->resource),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
