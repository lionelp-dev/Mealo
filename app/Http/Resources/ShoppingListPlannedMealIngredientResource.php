<?php

namespace App\Http\Resources;

use App\Models\ShoppingListPlannedMealIngredient;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShoppingListPlannedMealIngredientResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var ShoppingListPlannedMealIngredient $shoppingListIngredient */
        $shoppingListIngredient = $this->resource;

        return [
            'id' => $shoppingListIngredient->id,
            'ingredient_id' => $shoppingListIngredient->ingredient_id,
            'is_checked' => $shoppingListIngredient->is_checked,
            'created_at' => $shoppingListIngredient->created_at,
            'updated_at' => $shoppingListIngredient->updated_at,
        ];
    }
}
