<?php

namespace App\Http\Resources;

use App\Models\Step;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StepResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var Step $step */
        $step = $this->resource;

        return [
            'id' => $step->id,
            'order' => $step->order,
            'description' => $step->description,
        ];
    }
}
