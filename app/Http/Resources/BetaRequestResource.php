<?php

namespace App\Http\Resources;

use App\Models\BetaRequest;
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
        /** @var BetaRequest $betaRequest */
        $betaRequest = $this->resource;

        return [
            'id' => $betaRequest->id,
            'email' => $betaRequest->email,
            'status' => $betaRequest->status,
            'created_at' => $betaRequest->created_at,
            'approved_at' => $betaRequest->approved_at,
            'token_expires_at' => $betaRequest->token_expires_at,
            'rejection_reason' => $betaRequest->rejection_reason,
            'approved_by' => $this->when($betaRequest->relationLoaded('approvedBy') && $betaRequest->approvedBy, function () use ($betaRequest) {
                $approvedBy = $betaRequest->approvedBy;
                if ($approvedBy === null) {
                    return null;
                }

                return [
                    'id' => $approvedBy->id,
                    'name' => $approvedBy->name,
                ];
            }),
        ];
    }
}
