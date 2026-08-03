<?php

namespace App\Messages\PlannedMeal;

use App\Concerns\HasDefaultMessage;
use App\Messages\Message;

class PlannedMealUpdatedMessage extends Message
{
    use HasDefaultMessage;

    protected static function translationKey(): ?string
    {
        return 'messages.planned_meal.updated';
    }

    protected static function defaultMessage(): string
    {
        return 'Planned meal successfully updated';
    }
}
