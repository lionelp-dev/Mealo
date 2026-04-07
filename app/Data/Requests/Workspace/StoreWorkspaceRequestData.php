<?php

namespace App\Data\Requests\Workspace;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class StoreWorkspaceRequestData extends Data
{
    public function __construct(
        public string $name,
        public bool $is_personal,
    ) {}

    /**
     * @return array<string, string>
     */
    public static function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'is_personal' => 'required|boolean',
        ];
    }
}
