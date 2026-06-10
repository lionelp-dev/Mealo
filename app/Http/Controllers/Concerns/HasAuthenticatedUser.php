<?php

namespace App\Http\Controllers\Concerns;

use App\Models\User;

trait HasAuthenticatedUser
{
    protected function authenticatedUser(): User
    {
        return auth()->user();
    }
}
