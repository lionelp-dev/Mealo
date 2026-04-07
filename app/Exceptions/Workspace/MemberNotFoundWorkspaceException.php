<?php

namespace App\Exceptions\Workspace;

use Exception;

class MemberNotFoundWorkspaceException extends Exception
{
    protected $message = 'This user is not a member of this workspace.';
}
