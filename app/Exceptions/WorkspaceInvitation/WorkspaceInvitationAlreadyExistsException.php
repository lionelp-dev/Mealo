<?php

namespace App\Exceptions\WorkspaceInvitation;

use App\Concerns\HasDefaultMessage;
use Exception;

class WorkspaceInvitationAlreadyExistsException extends Exception
{
    use HasDefaultMessage;

    protected static function defaultMessage(): string
    {
        return 'An invitation is already pending for this email';
    }
}
