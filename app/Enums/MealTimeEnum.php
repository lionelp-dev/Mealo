<?php

namespace App\Enums;

enum MealTimeEnum: string
{
    case Breakfast = "breakfast";
    case Lunch = "lunch";
    case Diner = "diner";
    case Snack = "snack";

    public static function values(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }
}
