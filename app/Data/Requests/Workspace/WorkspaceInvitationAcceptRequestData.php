<?php

namespace App\Data\Requests\Workspace;

use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class WorkspaceInvitationAcceptRequestData extends Data
{
    public function __construct(
        #[FromRouteParameter('token')]
        public string $token,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public static function rules(): array
    {
        return [
            'token' => 'required|string',
        ];
    }
}
