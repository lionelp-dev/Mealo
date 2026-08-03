<?php

namespace App\Exceptions\ShoppingList;

use App\Concerns\HasDefaultMessage;
use Illuminate\Auth\Access\AuthorizationException;

class ShoppingListUpdateAuthorizationException extends AuthorizationException
{
    use HasDefaultMessage;

    protected static function translationKey(): ?string
    {
        return 'authorization.shopping_list.update_denied';
    }

    protected static function defaultMessage(): string
    {
        return 'You do not have permission to update this shopping list';
    }
}
