<?php

namespace App\Messages\PlannedMeal;

use App\Concerns\HasDefaultMessage;
use App\Messages\Message;

class PlannedMealUnplannedMessage extends Message
{
    use HasDefaultMessage;

    protected static function translationKey(): ?string
    {
        return 'messages.planned_meal.unplanned';
    }

    protected static function defaultMessage(): string
    {
        return 'Planned meal successfully unplanned';
    }
}
