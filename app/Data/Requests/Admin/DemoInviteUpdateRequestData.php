<?php

namespace App\Data\Requests\Admin;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class DemoInviteUpdateRequestData extends Data
{
    public function __construct(
        public ?string $label,
        public int $max_uses,
        public ?string $expires_at,
        public bool $is_active,
    ) {}

    /**
     * @return array<string, string>
     */
    public static function rules(): array
    {
        return [
            'label' => 'nullable|string|max:255',
            'max_uses' => 'required|integer|min:1',
            'expires_at' => 'nullable|date',
            'is_active' => 'required|boolean',
        ];
    }
}
