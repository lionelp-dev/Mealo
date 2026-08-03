<?php

namespace App\Exceptions\Workspace;

use App\Concerns\HasDefaultMessage;
use Illuminate\Auth\Access\AuthorizationException;

class WorkspaceOwnerRoleChangeAuthorizationException extends AuthorizationException
{
    use HasDefaultMessage;

    protected static function defaultMessage(): string
    {
        return 'Cannot change owner role';
    }
}
