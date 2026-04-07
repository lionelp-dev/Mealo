<?php

namespace App\Exceptions\WokspaceInvitation;

use Exception;

class NotFoundWorkspaceInvitationException extends Exception
{
    protected $message = 'Workspace invitation not found';
}
