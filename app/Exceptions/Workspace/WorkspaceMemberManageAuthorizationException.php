<?php

namespace App\Exceptions\Workspace;

use App\Concerns\HasDefaultMessage;
use Illuminate\Auth\Access\AuthorizationException;

class WorkspaceMemberManageAuthorizationException extends AuthorizationException
{
    use HasDefaultMessage;

    protected static function translationKey(): ?string
    {
        return 'authorization.workspace.manage_member_denied';
    }

    protected static function defaultMessage(): string
    {
        return 'You are not authorized to manage workspace members.';
    }
}
