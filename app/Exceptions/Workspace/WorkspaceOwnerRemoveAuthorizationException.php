<?php

namespace App\Exceptions\Workspace;

use App\Concerns\HasDefaultMessage;
use Illuminate\Auth\Access\AuthorizationException;

class WorkspaceOwnerRemoveAuthorizationException extends AuthorizationException
{
    use HasDefaultMessage;

    protected static function defaultMessage(): string
    {
        return 'Cannot remove workspace owner';
    }
}
