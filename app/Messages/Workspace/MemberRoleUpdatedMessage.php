<?php

namespace App\Messages\Workspace;

use App\Concerns\HasDefaultMessage;
use App\Messages\Message;

class MemberRoleUpdatedMessage extends Message
{
    use HasDefaultMessage;

    protected static function translationKey(): ?string
    {
        return 'messages.workspace.member_role_updated';
    }

    protected static function defaultMessage(): string
    {
        return 'Member role updated successfully';
    }
}
