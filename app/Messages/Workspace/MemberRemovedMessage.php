<?php

namespace App\Messages\Workspace;

use App\Messages\Message;

class MemberRemovedMessage extends Message
{
    public function __construct(?string $message = null)
    {
        parent::__construct(
            $message ?? __('messages.workspace.member_removed')
        );
    }
}
