<?php

namespace App\Messages\Workspace;

use App\Concerns\HasDefaultMessage;
use App\Messages\Message;

class WorkspaceUpdatedMessage extends Message
{
    use HasDefaultMessage;

    protected static function translationKey(): ?string
    {
        return 'messages.workspace.updated';
    }

    protected static function defaultMessage(): string
    {
        return 'Workspace updated successfully';
    }
}
