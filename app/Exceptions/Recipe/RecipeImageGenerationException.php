<?php

namespace App\Exceptions\Recipe;

use App\Concerns\HasDefaultMessage;
use App\Messages\Recipe\RecipeImageGenerationFailedMessage;
use Exception;

class RecipeImageGenerationException extends Exception
{
    use HasDefaultMessage;

    protected static function defaultMessage(): string
    {
        return RecipeImageGenerationFailedMessage::message();
    }
}
