<?php

namespace App\Data\Requests\Recipe;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class DeleteRecipesRequestData extends Data
{
    public function __construct(
        /** @var array<string> $ids */
        public array $ids,
    ) {}

    /**
     * @return array<string, string>
     */
    public static function rules(): array
    {
        return [
            'ids' => 'required|array',
            'ids.*' => 'uuid:7',
        ];
    }
}
