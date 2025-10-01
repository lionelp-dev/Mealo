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
            "id" => $this->resource->id,
            'name' => $this->resource->name,
            'quantity' => $this->resource->pivot->quantity,
            'unit' => $this->resource->pivot->unit,
        ];
    }
}
