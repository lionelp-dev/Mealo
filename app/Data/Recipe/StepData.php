<?php

namespace App\Data\Recipe;

use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class StepData extends Data
{
    public function __construct(
        public ?int $id,
        #[Required, Min(0)]
        public int $order,
        #[Required]
        public string $description,
    ) {}
}
