<?php

namespace App\Messages\WorkspaceInvitation;

use App\Concerns\HasDefaultMessage;
use App\Messages\Message;

class InvitationCancelledMessage extends Message
{
    use HasDefaultMessage;

    protected static function translationKey(): ?string
    {
        return 'messages.workspace_invitation.cancelled';
    }

    protected static function defaultMessage(): string
    {
        return 'Invitation cancelled';
    }
}
