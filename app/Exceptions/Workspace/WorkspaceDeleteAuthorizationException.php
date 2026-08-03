<?php

namespace App\Exceptions\Workspace;

use App\Concerns\HasDefaultMessage;
use Illuminate\Auth\Access\AuthorizationException;

class WorkspaceDeleteAuthorizationException extends AuthorizationException
{
    use HasDefaultMessage;

    protected static function translationKey(): ?string
    {
        return 'authorization.workspace.delete_denied';
    }

    protected static function defaultMessage(): string
    {
        return 'You are not authorized to delete this workspace.';
    }
}
