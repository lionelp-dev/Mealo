<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureGlobalPermissionContext
{
    /**
     * Handle an incoming request.
     *
     * Sets the permissions team ID to null to ensure global permission checks
     * (used for admin routes that should not be scoped to workspaces).
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  Closure(): void  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Set team context to null for global permissions
        setPermissionsTeamId(null);

        return $next($request);
    }
}
