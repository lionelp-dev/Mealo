<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlannedMealResource extends JsonResource
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
            'planned_date' => $this->resource->planned_date,
            'meal_time_id' => $this->resource->meal_time_id,
            'serving_size' => $this->resource->serving_size,
            'recipe' => $this->whenLoaded('recipe', function () {
                return [
                    'id' => $this->resource->recipe->id,
                    'name' => $this->resource->recipe->name,
                    'image_url' => $this->resource->recipe->getImageUrl(),
                ];
            }),
        ];
    }
}
