<?php

namespace App\Data\Recipe\Resources;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class TagResourceData extends Data
{
    public function __construct(
        public ?int $id,
        public string $name,
    ) {}
}
