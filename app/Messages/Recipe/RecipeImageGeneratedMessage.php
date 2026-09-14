<?php

namespace App\Messages\Recipe;

use App\Concerns\HasDefaultMessage;
use App\Messages\Message;

class RecipeImageGeneratedMessage extends Message
{
    use HasDefaultMessage;

    protected static function translationKey(): ?string
    {
        return 'messages.recipe.image_generated';
    }

    protected static function defaultMessage(): string
    {
        return 'Recipe image generated successfully.';
    }
}
