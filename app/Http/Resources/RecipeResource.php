<?php

namespace App\Http\Resources;

use App\Models\Recipe;
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
        /** @var Recipe $recipe */
        $recipe = $this->resource;

        return [
            'id' => $recipe->id,
            'user_id' => $recipe->user_id,
            'name' => $recipe->name,
            'description' => $recipe->description,
            'serving_size' => $recipe->serving_size,
            'preparation_time' => $recipe->preparation_time,
            'cooking_time' => $recipe->cooking_time,
            'meal_times' => $this->when($recipe->relationLoaded('mealTimes'), function () use ($recipe) {
                return MealTimeResource::collection($recipe->mealTimes)->toArray(request());
            }, []),
            'ingredients' => $this->when($recipe->relationLoaded('ingredients'), function () use ($recipe) {
                return IngredientResource::collection($recipe->ingredients)->toArray(request());
            }, []),
            'steps' => $this->when($recipe->relationLoaded('steps'), function () use ($recipe) {
                return StepResource::collection($recipe->steps)->toArray(request());
            }, []),
            'tags' => $this->when($recipe->relationLoaded('tags'), function () use ($recipe) {
                return TagResource::collection($recipe->tags)->toArray(request());
            }, []),
            'image_url' => $recipe->getImageUrl() ?? null,
            'created_at' => $recipe->created_at,
            'updated_at' => $recipe->updated_at,
        ];
    }
}
