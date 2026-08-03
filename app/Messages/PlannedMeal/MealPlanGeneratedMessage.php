<?php

namespace App\Messages\PlannedMeal;

use App\Concerns\HasDefaultMessage;
use App\Messages\Message;

class MealPlanGeneratedMessage extends Message
{
    use HasDefaultMessage;

    protected static function translationKey(): ?string
    {
        return 'messages.planned_meal.plan_generated';
    }

    protected static function defaultMessage(): string
    {
        return 'Meal plan generated successfully! :count meals created.';
    }

    public static function forCreatedCount(int $count): string
    {
        $translationKey = static::translationKey();
        $message = static::defaultMessage();

        if ($translationKey !== null) {
            $message = t($translationKey, $message);
        }

        return str_replace(':count', (string) $count, $message);
    }
}
