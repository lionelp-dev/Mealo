<?php

namespace App\Data\Resources\Workspace\Entities;

use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceUser;
use Carbon\Carbon;
use RuntimeException;
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
        $pivot = $user->getRelation('pivot');
        if (! $pivot instanceof WorkspaceUser) {
            throw new RuntimeException('Workspace member pivot is not loaded.');
        }

        return new self(
            id: $user->id,
            name: $user->name,
            email: $user->email,
            role: $workspace->getUserRole($user),
            joined_at: $pivot->joined_at,
        );
    }
}
