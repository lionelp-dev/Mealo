import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\UserManagementController::extend
* @see app/Http/Controllers/Admin/UserManagementController.php:53
* @route '/admin/users/{user}/demo/extend'
*/
export const extend = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: extend.url(args, options),
    method: 'post',
})

extend.definition = {
    methods: ["post"],
    url: '/admin/users/{user}/demo/extend',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\UserManagementController::extend
* @see app/Http/Controllers/Admin/UserManagementController.php:53
* @route '/admin/users/{user}/demo/extend'
*/
extend.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return extend.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserManagementController::extend
* @see app/Http/Controllers/Admin/UserManagementController.php:53
* @route '/admin/users/{user}/demo/extend'
*/
extend.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: extend.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\UserManagementController::extend
* @see app/Http/Controllers/Admin/UserManagementController.php:53
* @route '/admin/users/{user}/demo/extend'
*/
const extendForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: extend.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\UserManagementController::extend
* @see app/Http/Controllers/Admin/UserManagementController.php:53
* @route '/admin/users/{user}/demo/extend'
*/
extendForm.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: extend.url(args, options),
    method: 'post',
})

extend.form = extendForm

/**
* @see \App\Http\Controllers\Admin\UserManagementController::revoke
* @see app/Http/Controllers/Admin/UserManagementController.php:65
* @route '/admin/users/{user}/demo/revoke'
*/
export const revoke = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: revoke.url(args, options),
    method: 'post',
})

revoke.definition = {
    methods: ["post"],
    url: '/admin/users/{user}/demo/revoke',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\UserManagementController::revoke
* @see app/Http/Controllers/Admin/UserManagementController.php:65
* @route '/admin/users/{user}/demo/revoke'
*/
revoke.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return revoke.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserManagementController::revoke
* @see app/Http/Controllers/Admin/UserManagementController.php:65
* @route '/admin/users/{user}/demo/revoke'
*/
revoke.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: revoke.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\UserManagementController::revoke
* @see app/Http/Controllers/Admin/UserManagementController.php:65
* @route '/admin/users/{user}/demo/revoke'
*/
const revokeForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: revoke.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\UserManagementController::revoke
* @see app/Http/Controllers/Admin/UserManagementController.php:65
* @route '/admin/users/{user}/demo/revoke'
*/
revokeForm.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: revoke.url(args, options),
    method: 'post',
})

revoke.form = revokeForm

const demo = {
    extend: Object.assign(extend, extend),
    revoke: Object.assign(revoke, revoke),
}

export default demo