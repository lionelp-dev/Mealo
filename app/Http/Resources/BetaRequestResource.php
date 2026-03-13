<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BetaRequestResource extends JsonResource
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
            'email' => $this->resource->email,
            'status' => $this->resource->status,
            'created_at' => $this->resource->created_at,
            'approved_at' => $this->resource->approved_at,
            'token_expires_at' => $this->resource->token_expires_at,
            'rejection_reason' => $this->resource->rejection_reason,
            'approved_by' => $this->when($this->relationLoaded('approvedBy') && $this->approvedBy, function () {
                return [
                    'id' => $this->approvedBy->id,
                    'name' => $this->approvedBy->name,
                ];
            }),
        ];
    }
}
