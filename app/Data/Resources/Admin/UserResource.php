<?php

namespace App\Data\Resources\Admin;

use App\Models\User;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class UserResource extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public string $email,
        public bool $is_admin,
        public bool $is_demo,
        public ?CarbonImmutable $demo_expires_at,
        public int $recipes_count,
        public int $workspaces_count,
        public CarbonImmutable $created_at,
    ) {}

    public static function fromModel(User $user): self
    {
        $demoAccount = $user->demoAccount;

        return new self(
            id: $user->id,
            name: $user->name,
            email: $user->email,
            is_admin: $user->isAdmin(),
            is_demo: $demoAccount !== null,
            demo_expires_at: $demoAccount?->expires_at,
            recipes_count: (int) ($user->recipes_count ?? $user->recipes()->count()),
            workspaces_count: (int) ($user->workspaces_count ?? $user->workspaces()->count()),
            created_at: $user->created_at,
        );
    }
}
