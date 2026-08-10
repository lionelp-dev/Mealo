<?php

namespace App\Messages\Recipe;

use App\Concerns\HasDefaultMessage;
use App\Messages\Message;

class RecipeImageGenerationFailedMessage extends Message
{
    use HasDefaultMessage;

    protected static function translationKey(): ?string
    {
        return 'messages.recipe.image_generation_failed';
    }

    protected static function defaultMessage(): string
    {
        return 'Unable to generate the recipe image right now.';
    }
}
