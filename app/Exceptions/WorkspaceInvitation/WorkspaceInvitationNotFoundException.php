<?php

namespace App\Exceptions\WorkspaceInvitation;

use App\Concerns\HasDefaultMessage;
use Exception;

class WorkspaceInvitationNotFoundException extends Exception
{
    use HasDefaultMessage;

    protected static function defaultMessage(): string
    {
        return 'Workspace invitation not found';
    }
}
