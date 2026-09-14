<?php

namespace App\Messages\Recipe;

use App\Concerns\HasDefaultMessage;
use App\Messages\Message;

class RecipePrefilledMessage extends Message
{
    use HasDefaultMessage;

    protected static function translationKey(): ?string
    {
        return 'messages.recipe.prefilled';
    }

    protected static function defaultMessage(): string
    {
        return 'Recipe fields successfully prefilled.';
    }
}
