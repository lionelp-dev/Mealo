<?php

namespace App\Data\Requests\Workspace;

use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class DeleteWorkspaceInvitationRequestData extends Data
{
    public function __construct(
        #[FromRouteParameter('invitation')]
        public int $invitation,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public static function rules(): array
    {
        return [
            'invitation' => 'required|integer|exists:workspace_invitations,id',
        ];
    }
}
