<?php

namespace App\Traits;

use App\Models\User;

trait AuthUser
{
    protected function user(): User
    {
        return auth()->user();
    }
}
