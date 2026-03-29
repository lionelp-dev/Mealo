<?php

namespace App\Data\Requests\Recipe\Entities;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class StepRequestData extends Data
{
    public function __construct(
        public int $order,
        public string $description,
    ) {}

    /**
     * @return array<string, string>
     */
    public static function rules(): array
    {
        return [
            'id' => 'sometimes|required|integer|min:1',
            'order' => 'required|integer|min:1|max:100',
            'description' => 'required|string|min:1|max:1000',
        ];
    }
}
