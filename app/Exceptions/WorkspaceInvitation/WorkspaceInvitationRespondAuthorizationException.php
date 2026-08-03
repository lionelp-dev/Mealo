<?php

namespace App\Exceptions\WorkspaceInvitation;

use App\Concerns\HasDefaultMessage;
use Illuminate\Auth\Access\AuthorizationException;

class WorkspaceInvitationRespondAuthorizationException extends AuthorizationException
{
    use HasDefaultMessage;

    protected static function defaultMessage(): string
    {
        return 'This invitation is not for you';
    }
}
