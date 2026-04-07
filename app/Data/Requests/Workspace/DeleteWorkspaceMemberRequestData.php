<?php

namespace App\Data\Requests\Workspace;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class DeleteWorkspaceMemberRequestData extends Data
{
    public function __construct(
        public int $user_id,
    ) {}

    /**
     * @return array<string, string>
     */
    public static function rules(): array
    {
        return [
            'user_id' => 'required|exists:users,id',
        ];
    }
}
