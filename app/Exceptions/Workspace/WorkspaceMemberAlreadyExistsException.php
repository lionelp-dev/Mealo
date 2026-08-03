<?php

namespace App\Exceptions\Workspace;

use App\Concerns\HasDefaultMessage;
use Exception;

class WorkspaceMemberAlreadyExistsException extends Exception
{
    use HasDefaultMessage;

    protected static function defaultMessage(): string
    {
        return 'User is already a member of this workspace';
    }
}
