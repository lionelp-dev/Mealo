<?php

namespace App\Enums;

enum MealTimeEnum: string
{
    case Breakfast = 'breakfast';
    case Lunch = 'lunch';
    case Diner = 'diner';
    case Snack = 'snack';

    public function label(): string
    {
        return match ($this) {
            self::Breakfast => 'Petit-déjeuner',
            self::Lunch => 'Déjeuner',
            self::Diner => 'Dîner',
            self::Snack => 'Collation',
        };
    }

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_map(fn (self $case) => $case->value, self::cases());
    }
}
