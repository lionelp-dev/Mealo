<?php

namespace App\Http\Controllers\Concerns;

use App\Models\User;
use Illuminate\Auth\AuthenticationException;

trait HasAuthenticatedUser
{
    /**
     * @throws AuthenticationException
     */
    protected function authenticatedUser(): User
    {
        $user = auth()->user();

        if (! $user instanceof User) {
            throw new AuthenticationException;
        }

        return $user;
    }
}
