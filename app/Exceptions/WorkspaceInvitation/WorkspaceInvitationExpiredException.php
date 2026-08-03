<?php

namespace App\Exceptions\WorkspaceInvitation;

use App\Concerns\HasDefaultMessage;
use Exception;

class WorkspaceInvitationExpiredException extends Exception
{
    use HasDefaultMessage;

    protected static function defaultMessage(): string
    {
        return 'This invitation is expired';
    }
}
