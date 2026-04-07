<?php

namespace App\Exceptions\WokspaceInvitation;

use Exception;

class ExpiredWorkspaceInvitationException extends Exception
{
    protected $message = 'This invitation is expired';
}
