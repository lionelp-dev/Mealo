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
            'meal_times' => MealTimeResource::collection($this->whenLoaded('mealTimes'))->toArray(request()),
            'ingredients' => IngredientResource::collection($this->whenLoaded('ingredients'))->toArray(request()),
            'steps' => StepResource::collection($this->whenLoaded('steps'))->toArray(request()),
            'tags' => TagResource::collection($this->whenLoaded('tags'))->toArray(request()),
            'created_at' => $this->resource->created_at,
            'updated_at' => $this->resource->updated_at,
        ];
    }
}
