<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShoppingListIngredientResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'shopping_list_id' => $this->resource->shopping_list_id,
            'ingredient_id' => $this->resource->ingredient_id,
            'ingredient' => $this->whenLoaded('ingredient', function () {
                return [
                    'id' => $this->resource->ingredient->id,
                    'name' => $this->resource->ingredient->name,
                ];
            }),
            'quantity' => $this->resource->quantity,
            'unit' => $this->resource->unit,
            'is_checked' => $this->resource->is_checked,
            'created_at' => $this->resource->created_at,
            'updated_at' => $this->resource->updated_at,
        ];
    }
}
