<?php

namespace App\Messages\Recipe;

use App\Concerns\HasDefaultMessage;
use App\Messages\Message;

class RecipeDeletedMessage extends Message
{
    use HasDefaultMessage;

    protected static function translationKey(): ?string
    {
        return 'messages.recipe.deleted';
    }

    protected static function defaultMessage(): string
    {
        return 'Recipe successfully deleted';
    }
}
