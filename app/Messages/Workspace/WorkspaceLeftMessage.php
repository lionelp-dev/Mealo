<?php

namespace App\Messages\Workspace;

use App\Concerns\HasDefaultMessage;
use App\Messages\Message;

class WorkspaceLeftMessage extends Message
{
    use HasDefaultMessage;

    protected static function translationKey(): ?string
    {
        return 'messages.workspace.left';
    }

    protected static function defaultMessage(): string
    {
        return 'You have left the workspace.';
    }
}
