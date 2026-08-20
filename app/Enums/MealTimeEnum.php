<?php

namespace App\Enums;

enum MealTimeEnum: string
{
    case Breakfast = 'breakfast';
    case Lunch = 'lunch';
    case Diner = 'diner';
    case Snack = 'snack';

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_map(fn (self $case) => $case->value, self::cases());
    }
}
