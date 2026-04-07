<?php

namespace App\Exceptions\Workspace;

use Exception;

class MemberAlreadyExistWorkspaceException extends Exception
{
    protected $message = 'User is already a member of this workspace';
}
