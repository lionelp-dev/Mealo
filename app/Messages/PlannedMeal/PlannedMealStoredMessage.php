<?php

namespace App\Messages\PlannedMeal;

use App\Concerns\HasDefaultMessage;
use App\Messages\Message;

class PlannedMealStoredMessage extends Message
{
    use HasDefaultMessage;

    protected static function translationKey(): ?string
    {
        return 'messages.planned_meal.stored';
    }

    protected static function defaultMessage(): string
    {
        return 'Meal successfully planned';
    }
}
