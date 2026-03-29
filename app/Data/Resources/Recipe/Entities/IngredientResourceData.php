<?php

namespace App\Data\Resources\Recipe\Entities;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class IngredientResourceData extends Data
{
    public function __construct(
        public string $id,
        public string $name,
    ) {}
}
