<?php

namespace App\Data\Recipe\Requests;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class GenerateRecipeRequestData extends Data
{
    public function __construct(
        #[Min(5), Max(255)]
        public string $prompt,
    ) {}
}
