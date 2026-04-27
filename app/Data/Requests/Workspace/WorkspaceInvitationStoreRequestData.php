<?php

namespace App\Data\Requests\Workspace;

use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class WorkspaceInvitationStoreRequestData extends Data
{
    public function __construct(
        #[FromRouteParameter('workspace_id')]
        public int $workspace_id,
        public string $email,
        #[LiteralTypeScriptType("'editor' | 'viewer'")]
        public string $role,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public static function rules(): array
    {
        return [
            'workspace_id' => 'required|integer',
            'email' => 'required|email',
            'role' => 'required|in:editor,viewer',
        ];
    }
}
