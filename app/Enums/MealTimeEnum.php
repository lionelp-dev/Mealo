<?php

namespace App\Enums;

use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
#[LiteralTypeScriptType("'breakfast' | 'lunch' | 'diner' | 'snack'")]
enum MealTimeEnum: string
{
    case Breakfast = 'breakfast';
    case Lunch = 'lunch';
    case Diner = 'diner';
    case Snack = 'snack';

    public static function values(): array
    {
        return array_map(fn ($case) => $case->value, self::cases());
    }
}
