<?php

namespace App\Messages\Recipe;

use App\Concerns\HasDefaultMessage;
use App\Messages\Message;

class RecipeGenerationQueuedMessage extends Message
{
    use HasDefaultMessage;

    protected static function translationKey(): ?string
    {
        return 'messages.recipe.generation_queued';
    }

    protected static function defaultMessage(): string
    {
        return 'Recipe generation started. The recipes will appear shortly.';
    }
}
