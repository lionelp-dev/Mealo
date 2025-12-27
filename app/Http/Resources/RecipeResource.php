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
            'meal_times' => $this->when($this->relationLoaded('mealTimes'), function () {
                return MealTimeResource::collection($this->mealTimes)->toArray(request());
            }, []),
            'ingredients' => $this->when($this->relationLoaded('ingredients'), function () {
                return IngredientResource::collection($this->ingredients)->toArray(request());
            }, []),
            'steps' => $this->when($this->relationLoaded('steps'), function () {
                return StepResource::collection($this->steps)->toArray(request());
            }, []),
            'tags' => $this->when($this->relationLoaded('tags'), function () {
                return TagResource::collection($this->tags)->toArray(request());
            }, []),
            'image_url' => $this->resource->getImageUrl() ?? null,
            'created_at' => $this->resource->created_at,
            'updated_at' => $this->resource->updated_at,
        ];
    }
}
