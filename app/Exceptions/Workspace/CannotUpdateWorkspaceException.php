<?php

namespace App\Exceptions\Workspace;

use Illuminate\Auth\Access\AuthorizationException;

class CannotUpdateWorkspaceException extends AuthorizationException
{
    public function __construct(?string $message = null)
    {
        parent::__construct(
            $message ?? t('authorization.workspace.update_denied', 'You are not authorized to update this workspace.')
        );
    }
}
