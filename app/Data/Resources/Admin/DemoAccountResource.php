<?php

namespace App\Data\Resources\Admin;

use App\Models\DemoAccount;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class DemoAccountResource extends Data
{
    public function __construct(
        public int $id,
        public ?int $user_id,
        public ?string $user_name,
        public ?string $user_email,
        public string $token,
        public CarbonImmutable $expires_at,
        public bool $is_expired,
        public CarbonImmutable $created_at,
    ) {}

    public static function fromModel(DemoAccount $demoAccount): self
    {
        $user = $demoAccount->user;

        return new self(
            id: $demoAccount->id,
            user_id: $user?->id,
            user_name: $user?->name,
            user_email: $user?->email,
            token: $demoAccount->token,
            expires_at: $demoAccount->expires_at,
            is_expired: $demoAccount->isExpired(),
            created_at: $demoAccount->created_at,
        );
    }
}
