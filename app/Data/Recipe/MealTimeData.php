<?php

namespace App\Data\Recipe;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class MealTimeData extends Data
{
    public function __construct(
        public ?int $id,
        #[Required, Max(255)]
        public string $name,
    ) {}
}
