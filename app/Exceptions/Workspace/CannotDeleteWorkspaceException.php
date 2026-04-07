<?php

namespace App\Exceptions\Workspace;

use Illuminate\Auth\Access\AuthorizationException;

class CannotDeleteWorkspaceException extends AuthorizationException
{
    public function __construct(?string $message = null)
    {
        parent::__construct(
            $message ?? t('authorization.workspace.delete_denied', 'You are not authorized to delete this workspace.')
        );
    }
}
