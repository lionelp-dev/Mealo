<?php

namespace App\Http\Resources;

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
        return [
            'id' => $this->resource->id,
            'name' => $this->resource->name,
            'quantity' => $this->when($this->relationLoaded('pivot'), function () {
                return $this->pivot->quantity;
            }),
            'unit' => $this->when($this->relationLoaded('pivot'), function () {
                return $this->pivot->unit;
            }),
        ];
    }
}
