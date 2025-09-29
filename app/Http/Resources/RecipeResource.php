<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecipeResource extends JsonResource
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
            'user_id' => $this->resource->user_id,
            'name' => $this->resource->name,
            'description' => $this->resource->description,
            'preparation_time' => $this->resource->preparation_time,
            'cooking_time' => $this->resource->cooking_time,
            'meal_times' => $this->whenLoaded('mealTimes'),
            'ingredients' => $this->whenLoaded('ingredients'),
            'steps' => $this->whenLoaded('steps'),
            'tags' => $this->whenLoaded('tags'),
            'created_at' => $this->resource->created_at,
            'updated_at' => $this->resource->updated_at,
        ];
    }
}

