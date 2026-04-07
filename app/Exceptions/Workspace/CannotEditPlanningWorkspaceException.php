<?php

namespace App\Exceptions\Workspace;

use Illuminate\Auth\Access\AuthorizationException;

class CannotEditPlanningWorkspaceException extends AuthorizationException
{
    public function __construct(?string $message = null)
    {
        parent::__construct(
            $message ?? t('authorization.workspace.edit_planning_denied', 'You are not authorized to edit planning.')
        );
    }
}
