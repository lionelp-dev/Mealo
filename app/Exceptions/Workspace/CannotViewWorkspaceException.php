<?php

namespace App\Exceptions\Workspace;

use Illuminate\Auth\Access\AuthorizationException;

class CannotViewWorkspaceException extends AuthorizationException
{
    public function __construct(?string $message = null)
    {
        parent::__construct(
            $message ?? t('authorization.workspace.view_denied', 'You are not authorized to view this workspace.')
        );
    }
}
