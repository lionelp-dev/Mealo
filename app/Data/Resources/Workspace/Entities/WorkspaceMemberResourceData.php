<?php

namespace App\Data\Resources\Workspace\Entities;

use App\Models\User;
use App\Models\Workspace;
use Carbon\Carbon;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class WorkspaceMemberResourceData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public string $email,
        public ?string $role,
        public Carbon $joined_at,
    ) {}

    public static function fromModel(User $user, Workspace $workspace): self
    {
        return new self(
            id: $user->id,
            name: $user->name,
            email: $user->email,
            role: $workspace->getUserRole($user),
            joined_at: $user->pivot->joined_at,
        );
    }
}
