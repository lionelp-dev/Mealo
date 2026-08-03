<?php

namespace App\Exceptions\Workspace;

use App\Concerns\HasDefaultMessage;
use Exception;

class WorkspaceMemberNotFoundException extends Exception
{
    use HasDefaultMessage;

    protected static function defaultMessage(): string
    {
        return 'This user is not a member of this workspace.';
    }
}
