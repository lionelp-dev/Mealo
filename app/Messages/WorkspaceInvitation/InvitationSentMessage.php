<?php

namespace App\Messages\WorkspaceInvitation;

use App\Concerns\HasDefaultMessage;
use App\Messages\Message;

class InvitationSentMessage extends Message
{
    use HasDefaultMessage;

    protected static function translationKey(): ?string
    {
        return 'messages.workspace_invitation.sent';
    }

    protected static function defaultMessage(): string
    {
        return 'Invitation sent successfully';
    }
}
