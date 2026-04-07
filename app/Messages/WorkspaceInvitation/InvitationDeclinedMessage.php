<?php

namespace App\Messages\WorkspaceInvitation;

use App\Messages\Message;

class InvitationDeclinedMessage extends Message
{
    public function __construct(?string $message = null)
    {
        parent::__construct(
            $message ?? __('messages.workspace_invitation.declined')
        );
    }
}
