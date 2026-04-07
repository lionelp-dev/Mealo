<?php

namespace App\Exceptions\Workspace;

use Illuminate\Auth\Access\AuthorizationException;

class CannotChangeOwnerRoleWorkspaceException extends AuthorizationException
{
    protected $message = 'Cannot change owner role';
}
