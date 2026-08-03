<?php

namespace App\Messages\Workspace;

use App\Concerns\HasDefaultMessage;
use App\Messages\Message;

class MemberRemovedMessage extends Message
{
    use HasDefaultMessage;

    protected static function translationKey(): ?string
    {
        return 'messages.workspace.member_removed';
    }

    protected static function defaultMessage(): string
    {
        return 'Member removed successfully';
    }
}
