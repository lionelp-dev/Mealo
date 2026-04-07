<?php

namespace App\Data\Requests\Workspace;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class UpdateWorkspaceRequestData extends Data
{
    public function __construct(
        public ?string $name = null,
        public ?bool $is_personal = null,
    ) {}

    /**
     * @return array<string, string>
     */
    public static function rules(): array
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'is_personal' => 'sometimes|required|boolean',
        ];
    }
}
