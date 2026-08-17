<?php

namespace App\Data;

use App\Enums\MealTimeEnum;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class MealTimeData extends Data
{
    public function __construct(
        public MealTimeEnum $value,
    ) {}
}
