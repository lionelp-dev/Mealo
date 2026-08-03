<?php

namespace App\Messages\PlannedMeal;

use App\Concerns\HasDefaultMessage;
use App\Messages\Message;

class PlannedMealsUnplannedMessage extends Message
{
    use HasDefaultMessage;

    protected static function translationKey(): ?string
    {
        return 'messages.planned_meal.unplanned_many';
    }

    protected static function defaultMessage(): string
    {
        return 'Planned meals successfully unplanned';
    }
}
