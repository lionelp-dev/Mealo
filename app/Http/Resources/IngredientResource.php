<?php

namespace App\Http\Resources;

use App\Models\Ingredient;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IngredientResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var Ingredient $ingredient */
        $ingredient = $this->resource;

        return [
            'id' => $ingredient->id,
            'name' => $ingredient->name,
            'quantity' => $this->when($ingredient->relationLoaded('pivot'), function () use ($ingredient) {
                return $ingredient->pivot->quantity;
            }),
            'unit' => $this->when($ingredient->relationLoaded('pivot'), function () use ($ingredient) {
                return $ingredient->pivot->unit;
            }),
        ];
    }
}
