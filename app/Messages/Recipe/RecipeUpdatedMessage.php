<?php

namespace App\Messages\Recipe;

use App\Concerns\HasDefaultMessage;
use App\Messages\Message;

class RecipeUpdatedMessage extends Message
{
    use HasDefaultMessage;

    protected static function translationKey(): ?string
    {
        return 'messages.recipe.updated';
    }

    protected static function defaultMessage(): string
    {
        return 'Recipe successfully updated';
    }
}
