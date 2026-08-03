<?php

namespace App\Http\Resources;

use App\Models\PlannedMeal;
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
        /** @var PlannedMeal $plannedMeal */
        $plannedMeal = $this->resource;

        return [
            'id' => $plannedMeal->id,
            'planned_date' => $plannedMeal->planned_date,
            'meal_time_id' => $plannedMeal->meal_time_id,
            'meal_time_name' => $this->whenLoaded('mealTime', function () use ($plannedMeal) {
                return $plannedMeal->mealTime?->name;
            }),
            'serving_size' => $plannedMeal->serving_size,
            'recipe' => $this->whenLoaded('recipe', function () use ($plannedMeal) {
                $recipe = $plannedMeal->recipe;
                if ($recipe === null) {
                    return null;
                }

                return [
                    'id' => $recipe->id,
                    'name' => $recipe->name,
                ];
            }),
        ];
    }
}
