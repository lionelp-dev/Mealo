import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\UserManagementController::index
* @see app/Http/Controllers/Admin/UserManagementController.php:20
* @route '/admin/users'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\UserManagementController::index
* @see app/Http/Controllers/Admin/UserManagementController.php:20
* @route '/admin/users'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserManagementController::index
* @see app/Http/Controllers/Admin/UserManagementController.php:20
* @route '/admin/users'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\UserManagementController::index
* @see app/Http/Controllers/Admin/UserManagementController.php:20
* @route '/admin/users'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\UserManagementController::index
* @see app/Http/Controllers/Admin/UserManagementController.php:20
* @route '/admin/users'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\UserManagementController::index
* @see app/Http/Controllers/Admin/UserManagementController.php:20
* @route '/admin/users'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\UserManagementController::index
* @see app/Http/Controllers/Admin/UserManagementController.php:20
* @route '/admin/users'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Admin\UserManagementController::destroy
* @see app/Http/Controllers/Admin/UserManagementController.php:43
* @route '/admin/users/{user}'
*/
export const destroy = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/users/{user}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\UserManagementController::destroy
* @see app/Http/Controllers/Admin/UserManagementController.php:43
* @route '/admin/users/{user}'
*/
destroy.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserManagementController::destroy
* @see app/Http/Controllers/Admin/UserManagementController.php:43
* @route '/admin/users/{user}'
*/
destroy.delete = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\UserManagementController::destroy
* @see app/Http/Controllers/Admin/UserManagementController.php:43
* @route '/admin/users/{user}'
*/
const destroyForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\UserManagementController::destroy
* @see app/Http/Controllers/Admin/UserManagementController.php:43
* @route '/admin/users/{user}'
*/
destroyForm.delete = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\Admin\UserManagementController::extendDemo
* @see app/Http/Controllers/Admin/UserManagementController.php:53
* @route '/admin/users/{user}/demo/extend'
*/
export const extendDemo = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: extendDemo.url(args, options),
    method: 'post',
})

extendDemo.definition = {
    methods: ["post"],
    url: '/admin/users/{user}/demo/extend',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\UserManagementController::extendDemo
* @see app/Http/Controllers/Admin/UserManagementController.php:53
* @route '/admin/users/{user}/demo/extend'
*/
extendDemo.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return extendDemo.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserManagementController::extendDemo
* @see app/Http/Controllers/Admin/UserManagementController.php:53
* @route '/admin/users/{user}/demo/extend'
*/
extendDemo.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: extendDemo.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\UserManagementController::extendDemo
* @see app/Http/Controllers/Admin/UserManagementController.php:53
* @route '/admin/users/{user}/demo/extend'
*/
const extendDemoForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: extendDemo.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\UserManagementController::extendDemo
* @see app/Http/Controllers/Admin/UserManagementController.php:53
* @route '/admin/users/{user}/demo/extend'
*/
extendDemoForm.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: extendDemo.url(args, options),
    method: 'post',
})

extendDemo.form = extendDemoForm

/**
* @see \App\Http\Controllers\Admin\UserManagementController::revokeDemo
* @see app/Http/Controllers/Admin/UserManagementController.php:65
* @route '/admin/users/{user}/demo/revoke'
*/
export const revokeDemo = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: revokeDemo.url(args, options),
    method: 'post',
})

revokeDemo.definition = {
    methods: ["post"],
    url: '/admin/users/{user}/demo/revoke',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\UserManagementController::revokeDemo
* @see app/Http/Controllers/Admin/UserManagementController.php:65
* @route '/admin/users/{user}/demo/revoke'
*/
revokeDemo.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return revokeDemo.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserManagementController::revokeDemo
* @see app/Http/Controllers/Admin/UserManagementController.php:65
* @route '/admin/users/{user}/demo/revoke'
*/
revokeDemo.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: revokeDemo.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\UserManagementController::revokeDemo
* @see app/Http/Controllers/Admin/UserManagementController.php:65
* @route '/admin/users/{user}/demo/revoke'
*/
const revokeDemoForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: revokeDemo.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\UserManagementController::revokeDemo
* @see app/Http/Controllers/Admin/UserManagementController.php:65
* @route '/admin/users/{user}/demo/revoke'
*/
revokeDemoForm.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: revokeDemo.url(args, options),
    method: 'post',
})

revokeDemo.form = revokeDemoForm

const UserManagementController = { index, destroy, extendDemo, revokeDemo }

export default UserManagementController