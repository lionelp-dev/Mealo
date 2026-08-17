<?php

namespace App\Data;

use App\Enums\Unit;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class UnitData extends Data
{
    public function __construct(
        public Unit $value,
    ) {}
}
