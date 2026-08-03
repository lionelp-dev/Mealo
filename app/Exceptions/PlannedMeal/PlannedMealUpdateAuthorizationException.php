<?php

namespace App\Exceptions\PlannedMeal;

use App\Concerns\HasDefaultMessage;
use Illuminate\Auth\Access\AuthorizationException;

class PlannedMealUpdateAuthorizationException extends AuthorizationException
{
    use HasDefaultMessage;

    protected static function translationKey(): ?string
    {
        return 'authorization.planned_meal.update_denied';
    }

    protected static function defaultMessage(): string
    {
        return 'You do not have permission to update this planned meal';
    }
}
