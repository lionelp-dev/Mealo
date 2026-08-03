<?php

namespace App\Exceptions\Workspace;

use App\Concerns\HasDefaultMessage;
use Illuminate\Auth\Access\AuthorizationException;

class WorkspaceInviteAuthorizationException extends AuthorizationException
{
    use HasDefaultMessage;

    protected static function translationKey(): ?string
    {
        return 'authorization.workspace.invite_denied';
    }

    protected static function defaultMessage(): string
    {
        return 'You are not authorized to invite members.';
    }
}
