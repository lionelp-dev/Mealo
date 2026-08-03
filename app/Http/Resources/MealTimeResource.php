<?php

namespace App\Http\Resources;

use App\Models\MealTime;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MealTimeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var MealTime $mealTime */
        $mealTime = $this->resource;

        return [
            'id' => $mealTime->id,
            'name' => $mealTime->name,
        ];
    }
}
