<?php

namespace App\Exceptions\Workspace;

use Exception;

class CannotUpdateMemberWorkspaceException extends Exception
{
    public function __construct(?string $message = null)
    {
        parent::__construct(
            $message ?? t('authorization.workspace.manage_member_denied', 'You are not authorized to manage members.')
        );
    }
}
