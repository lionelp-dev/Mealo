<?php

namespace App\Exceptions\Workspace;

use Illuminate\Auth\Access\AuthorizationException;

class CannotRemoveOwnerWorkspaceException extends AuthorizationException
{
    protected $message = 'Cannot remove workspace owner';
}
