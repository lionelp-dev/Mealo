<?php

namespace App\Messages\ShoppingList;

use App\Concerns\HasDefaultMessage;
use App\Messages\Message;

class ShoppingListIngredientUpdatedMessage extends Message
{
    use HasDefaultMessage;

    protected static function translationKey(): ?string
    {
        return 'messages.shopping_list.ingredient_updated';
    }

    protected static function defaultMessage(): string
    {
        return 'Ingredient updated successfully';
    }
}
