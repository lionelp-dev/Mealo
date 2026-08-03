<?php

namespace App\Exceptions\WorkspaceInvitation;

use App\Concerns\HasDefaultMessage;
use Illuminate\Auth\Access\AuthorizationException;

class WorkspaceInvitationCancelAuthorizationException extends AuthorizationException
{
    use HasDefaultMessage;

    protected static function defaultMessage(): string
    {
        return "You don't have permission to cancel this invitation";
    }
}
