<?php

namespace App\Messages\WorkspaceInvitation;

use App\Concerns\HasDefaultMessage;
use App\Messages\Message;

class InvitationAcceptedMessage extends Message
{
    use HasDefaultMessage;

    protected static function translationKey(): ?string
    {
        return 'messages.workspace_invitation.accepted';
    }

    protected static function defaultMessage(): string
    {
        return 'Invitation accepted successfully.';
    }
}
