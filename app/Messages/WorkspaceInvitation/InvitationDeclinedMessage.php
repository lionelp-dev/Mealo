<?php

namespace App\Messages\WorkspaceInvitation;

use App\Concerns\HasDefaultMessage;
use App\Messages\Message;

class InvitationDeclinedMessage extends Message
{
    use HasDefaultMessage;

    protected static function translationKey(): ?string
    {
        return 'messages.workspace_invitation.declined';
    }

    protected static function defaultMessage(): string
    {
        return 'Invitation declined';
    }
}
