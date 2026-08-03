<?php

namespace App\Messages\Workspace;

use App\Concerns\HasDefaultMessage;
use App\Messages\Message;

class WorkspaceDeletedMessage extends Message
{
    use HasDefaultMessage;

    protected static function translationKey(): ?string
    {
        return 'messages.workspace.deleted';
    }

    protected static function defaultMessage(): string
    {
        return 'Workspace deleted successfully';
    }
}
