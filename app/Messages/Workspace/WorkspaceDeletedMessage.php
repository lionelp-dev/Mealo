<?php

namespace App\Messages\Workspace;

use App\Messages\Message;

class WorkspaceDeletedMessage extends Message
{
    public function __construct(?string $message = null)
    {
        parent::__construct(
            $message ?? __('messages.workspace.deleted')
        );
    }
}
