<?php

namespace App\Exceptions\WokspaceInvitation;

use Exception;

class AlreadyExistWorkspaceInvitationException extends Exception
{
    protected $message = 'An invitation is already pending for this email';
}
