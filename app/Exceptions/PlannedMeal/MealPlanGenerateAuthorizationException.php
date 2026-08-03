<?php

namespace App\Exceptions\PlannedMeal;

use App\Concerns\HasDefaultMessage;
use Illuminate\Auth\Access\AuthorizationException;

class MealPlanGenerateAuthorizationException extends AuthorizationException
{
    use HasDefaultMessage;

    protected static function translationKey(): ?string
    {
        return 'authorization.planned_meal.generate_denied';
    }

    protected static function defaultMessage(): string
    {
        return 'Unable to generate the meal plan';
    }
}
