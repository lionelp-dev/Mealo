<?php

namespace App\Exceptions\PlannedMeal;

use App\Concerns\HasDefaultMessage;
use Illuminate\Auth\Access\AuthorizationException;

class PlannedMealDeleteAuthorizationException extends AuthorizationException
{
    use HasDefaultMessage;

    protected static function translationKey(): ?string
    {
        return 'authorization.planned_meal.delete_denied';
    }

    protected static function defaultMessage(): string
    {
        return 'You do not have permission to delete planned meals';
    }
}
