<?php

namespace App\Messages\Workspace;

use App\Concerns\HasDefaultMessage;
use App\Messages\Message;

class WorkspaceCreatedMessage extends Message
{
    use HasDefaultMessage;

    protected static function translationKey(): ?string
    {
        return 'messages.workspace.created';
    }

    protected static function defaultMessage(): string
    {
        return 'Workspace created successfully';
    }
}
