<?php

namespace App\Data\Resources\Workspace\Entities;

use App\Models\WorkspaceInvitation;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class WorkspaceInvitationResourceData extends Data
{
    /**
     * @param  array<string, string|null>  $invited_by
     */
    public function __construct(
        public int $id,
        public int $workspace_id,
        public ?string $workspace_name,
        public ?int $workspace_users_count,
        public string $email,
        public string $role,
        public string $token,
        public CarbonImmutable $expires_at,
        #[LiteralTypeScriptType('{ name: string }')]
        public array $invited_by,
    ) {}

    public static function fromModel(WorkspaceInvitation $invitation): self
    {
        return new self(
            id: $invitation->id,
            workspace_id: $invitation->workspace_id,
            workspace_name: $invitation->workspace?->name,
            workspace_users_count: $invitation->workspace?->users?->count(),
            email: $invitation->email,
            role: $invitation->role,
            token: $invitation->token,
            expires_at: $invitation->expires_at,
            invited_by: [
                'name' => $invitation->invitedBy?->name,
            ],
        );
    }
}
