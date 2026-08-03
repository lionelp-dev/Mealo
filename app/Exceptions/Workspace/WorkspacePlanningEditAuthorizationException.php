<?php

namespace App\Exceptions\Workspace;

use App\Concerns\HasDefaultMessage;
use Illuminate\Auth\Access\AuthorizationException;

class WorkspacePlanningEditAuthorizationException extends AuthorizationException
{
    use HasDefaultMessage;

    protected static function translationKey(): ?string
    {
        return 'authorization.workspace.edit_planning_denied';
    }

    protected static function defaultMessage(): string
    {
        return 'You are not authorized to edit planning.';
    }
}
