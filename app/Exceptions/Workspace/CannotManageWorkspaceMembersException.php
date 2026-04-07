<?php

namespace App\Exceptions\Workspace;

use Illuminate\Auth\Access\AuthorizationException;

class CannotManageWorkspaceMembersException extends AuthorizationException
{
    public function __construct(?string $message = null)
    {
        parent::__construct(
            $message ?? t('authorization.workspace.manage_member_denied', 'You are not authorized to manage workspace members.')
        );
    }
}
