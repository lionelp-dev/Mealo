<?php

namespace App\Exceptions\WokspaceInvitation;

use Exception;

class CannotCancelWorkspaceInvitationException extends Exception
{
    protected $message = "You don't have permission to cancel this invitation";
}
