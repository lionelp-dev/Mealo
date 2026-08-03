<?php

namespace App\Messages\Workspace;

use App\Concerns\HasDefaultMessage;
use App\Messages\Message;

class WorkspaceSwitchedMessage extends Message
{
    use HasDefaultMessage;

    protected static function translationKey(): ?string
    {
        return 'messages.workspace.switched';
    }

    protected static function defaultMessage(): string
    {
        return 'Workspace switched successfully';
    }
}
