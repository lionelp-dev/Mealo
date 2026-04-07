<?php

namespace App\Messages\WorkspaceInvitation;

use App\Messages\Message;

class InvitationAcceptedMessage extends Message
{
    public function __construct(?string $message = null)
    {
        parent::__construct(
            $message ?? __('messages.workspace_invitation.accepted')
        );
    }
}
