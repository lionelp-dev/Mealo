<?php

namespace App\Exceptions\Recipe;

use App\Concerns\HasDefaultMessage;
use Illuminate\Auth\Access\AuthorizationException;

class RecipeDeleteAuthorizationException extends AuthorizationException
{
    use HasDefaultMessage;

    protected static function translationKey(): ?string
    {
        return 'authorization.recipe.delete_denied';
    }

    protected static function defaultMessage(): string
    {
        return 'You do not have permission to delete this recipe';
    }
}
