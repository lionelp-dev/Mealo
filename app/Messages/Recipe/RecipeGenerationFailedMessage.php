<?php

namespace App\Messages\Recipe;

use App\Concerns\HasDefaultMessage;
use App\Messages\Message;

class RecipeGenerationFailedMessage extends Message
{
    use HasDefaultMessage;

    protected static function translationKey(): ?string
    {
        return 'messages.recipe.generation_failed';
    }

    protected static function defaultMessage(): string
    {
        return 'Unable to start recipe generation. Please try again in a few moments.';
    }
}
