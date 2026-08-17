<?php

namespace App\Messages\Recipe;

use App\Concerns\HasDefaultMessage;
use App\Messages\Message;

class RecipesGeneratedMessage extends Message
{
    use HasDefaultMessage;

    protected static function translationKey(): ?string
    {
        return 'messages.recipe.generated';
    }

    protected static function defaultMessage(): string
    {
        return 'Recipes successfully generated';
    }
}
