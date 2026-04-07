<?php

namespace App\Exceptions\WokspaceInvitation;

use Exception;

class NotForYouWorkspaceInvitationException extends Exception
{
    protected $message = 'This invitation is not for you';
}
