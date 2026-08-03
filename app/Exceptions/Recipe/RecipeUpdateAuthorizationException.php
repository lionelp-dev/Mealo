<?php

namespace App\Exceptions\Recipe;

use App\Concerns\HasDefaultMessage;
use Illuminate\Auth\Access\AuthorizationException;

class RecipeUpdateAuthorizationException extends AuthorizationException
{
    use HasDefaultMessage;

    protected static function translationKey(): ?string
    {
        return 'authorization.recipe.update_denied';
    }

    protected static function defaultMessage(): string
    {
        return 'You do not have permission to update this recipe';
    }
}
