<?php

namespace App\Data\Recipe\Entities;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class MealTimeData extends Data
{
    public function __construct(
        public ?int $id,
        #[Min(1), Max(255)]
        public string $name,
    ) {}
}
