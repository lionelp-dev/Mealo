<?php

namespace App\Data\Resources\Recipe\Entities;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class MealTimeResourceData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
    ) {}
}
