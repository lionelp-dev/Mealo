<?php

namespace App\Data\Recipe;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class IngredientData extends Data
{
    public function __construct(
        public ?int $id,
        #[Required, Max(255)]
        public string $name,
        #[Required, Min(0)]
        public float $quantity,
        #[Required, Max(255)]
        public string $unit,
    ) {}
}
