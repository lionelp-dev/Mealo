<?php

namespace App\Data\Requests\Workspace;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class WorkspaceMemberRoleUpdateRequestData extends Data
{
    public function __construct(
        public int $user_id,
        #[LiteralTypeScriptType("'editor' | 'viewer'")]
        public string $role,
    ) {}

    /**
     * @return array<string, string>
     */
    public static function rules(): array
    {
        return [
            'user_id' => 'required|exists:users,id',
            'role' => 'required|in:editor,viewer',
        ];
    }
}
