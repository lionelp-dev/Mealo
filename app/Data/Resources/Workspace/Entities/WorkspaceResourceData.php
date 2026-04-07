<?php

namespace App\Data\Resources\Workspace\Entities;

use App\Models\Workspace;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class WorkspaceResourceData extends Data
{
    public function __construct(
        public int $id,
        public int $owner_id,
        public string $name,
        public bool $is_default,
        public bool $is_personal,
        public int $users_count,
        public CarbonImmutable $created_at,
        public CarbonImmutable $updated_at,

        /** @var Collection<int, WorkspaceMemberResourceData> */
        #[LiteralTypeScriptType('Array<WorkspaceMemberResourceData>')]
        public Collection $members,

        /** @var Collection<int, WorkspaceInvitationResourceData> */
        #[LiteralTypeScriptType('Array<WorkspaceInvitationResourceData>')]
        public Collection $pending_invitations,
    ) {}

    public static function fromModel(Workspace $workspace): self
    {
        return new self(
            id: $workspace->id,
            owner_id: $workspace->owner_id,
            name: $workspace->name,
            is_default: $workspace->is_default,
            is_personal: $workspace->is_personal,
            users_count: $workspace->users()->count(),
            created_at: $workspace->created_at,
            updated_at: $workspace->updated_at,
            members: collect($workspace->users()
                ->withPivot('joined_at')
                ->get()
                ->map(fn ($user) => WorkspaceMemberResourceData::fromModel($user, $workspace))),
            pending_invitations: collect($workspace->invitations()
                ->where('expires_at', '>', now())
                ->with('invitedBy:id,name')
                ->get()
                ->map(fn ($invitation) => WorkspaceInvitationResourceData::fromModel($invitation))),
        );
    }
}
