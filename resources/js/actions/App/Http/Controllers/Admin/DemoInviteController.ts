import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\DemoInviteController::index
* @see app/Http/Controllers/Admin/DemoInviteController.php:17
* @route '/admin/demo-invites'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/demo-invites',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DemoInviteController::index
* @see app/Http/Controllers/Admin/DemoInviteController.php:17
* @route '/admin/demo-invites'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DemoInviteController::index
* @see app/Http/Controllers/Admin/DemoInviteController.php:17
* @route '/admin/demo-invites'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DemoInviteController::index
* @see app/Http/Controllers/Admin/DemoInviteController.php:17
* @route '/admin/demo-invites'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\DemoInviteController::index
* @see app/Http/Controllers/Admin/DemoInviteController.php:17
* @route '/admin/demo-invites'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DemoInviteController::index
* @see app/Http/Controllers/Admin/DemoInviteController.php:17
* @route '/admin/demo-invites'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DemoInviteController::index
* @see app/Http/Controllers/Admin/DemoInviteController.php:17
* @route '/admin/demo-invites'
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
* @see \App\Http\Controllers\Admin\DemoInviteController::store
* @see app/Http/Controllers/Admin/DemoInviteController.php:29
* @route '/admin/demo-invites'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/demo-invites',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\DemoInviteController::store
* @see app/Http/Controllers/Admin/DemoInviteController.php:29
* @route '/admin/demo-invites'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DemoInviteController::store
* @see app/Http/Controllers/Admin/DemoInviteController.php:29
* @route '/admin/demo-invites'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\DemoInviteController::store
* @see app/Http/Controllers/Admin/DemoInviteController.php:29
* @route '/admin/demo-invites'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\DemoInviteController::store
* @see app/Http/Controllers/Admin/DemoInviteController.php:29
* @route '/admin/demo-invites'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Admin\DemoInviteController::update
* @see app/Http/Controllers/Admin/DemoInviteController.php:42
* @route '/admin/demo-invites/{demo_invite}'
*/
export const update = (args: { demo_invite: string | number } | [demo_invite: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/demo-invites/{demo_invite}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\DemoInviteController::update
* @see app/Http/Controllers/Admin/DemoInviteController.php:42
* @route '/admin/demo-invites/{demo_invite}'
*/
update.url = (args: { demo_invite: string | number } | [demo_invite: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { demo_invite: args }
    }

    if (Array.isArray(args)) {
        args = {
            demo_invite: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        demo_invite: args.demo_invite,
    }

    return update.definition.url
            .replace('{demo_invite}', parsedArgs.demo_invite.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DemoInviteController::update
* @see app/Http/Controllers/Admin/DemoInviteController.php:42
* @route '/admin/demo-invites/{demo_invite}'
*/
update.put = (args: { demo_invite: string | number } | [demo_invite: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\DemoInviteController::update
* @see app/Http/Controllers/Admin/DemoInviteController.php:42
* @route '/admin/demo-invites/{demo_invite}'
*/
update.patch = (args: { demo_invite: string | number } | [demo_invite: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\DemoInviteController::update
* @see app/Http/Controllers/Admin/DemoInviteController.php:42
* @route '/admin/demo-invites/{demo_invite}'
*/
const updateForm = (args: { demo_invite: string | number } | [demo_invite: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\DemoInviteController::update
* @see app/Http/Controllers/Admin/DemoInviteController.php:42
* @route '/admin/demo-invites/{demo_invite}'
*/
updateForm.put = (args: { demo_invite: string | number } | [demo_invite: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\DemoInviteController::update
* @see app/Http/Controllers/Admin/DemoInviteController.php:42
* @route '/admin/demo-invites/{demo_invite}'
*/
updateForm.patch = (args: { demo_invite: string | number } | [demo_invite: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Admin\DemoInviteController::destroy
* @see app/Http/Controllers/Admin/DemoInviteController.php:61
* @route '/admin/demo-invites/{demo_invite}'
*/
export const destroy = (args: { demo_invite: string | number } | [demo_invite: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/demo-invites/{demo_invite}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\DemoInviteController::destroy
* @see app/Http/Controllers/Admin/DemoInviteController.php:61
* @route '/admin/demo-invites/{demo_invite}'
*/
destroy.url = (args: { demo_invite: string | number } | [demo_invite: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { demo_invite: args }
    }

    if (Array.isArray(args)) {
        args = {
            demo_invite: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        demo_invite: args.demo_invite,
    }

    return destroy.definition.url
            .replace('{demo_invite}', parsedArgs.demo_invite.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DemoInviteController::destroy
* @see app/Http/Controllers/Admin/DemoInviteController.php:61
* @route '/admin/demo-invites/{demo_invite}'
*/
destroy.delete = (args: { demo_invite: string | number } | [demo_invite: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\DemoInviteController::destroy
* @see app/Http/Controllers/Admin/DemoInviteController.php:61
* @route '/admin/demo-invites/{demo_invite}'
*/
const destroyForm = (args: { demo_invite: string | number } | [demo_invite: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\DemoInviteController::destroy
* @see app/Http/Controllers/Admin/DemoInviteController.php:61
* @route '/admin/demo-invites/{demo_invite}'
*/
destroyForm.delete = (args: { demo_invite: string | number } | [demo_invite: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\DemoInviteController::toggle
* @see app/Http/Controllers/Admin/DemoInviteController.php:54
* @route '/admin/demo-invites/{demo_invite}/toggle'
*/
export const toggle = (args: { demo_invite: string | number } | [demo_invite: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(args, options),
    method: 'post',
})

toggle.definition = {
    methods: ["post"],
    url: '/admin/demo-invites/{demo_invite}/toggle',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\DemoInviteController::toggle
* @see app/Http/Controllers/Admin/DemoInviteController.php:54
* @route '/admin/demo-invites/{demo_invite}/toggle'
*/
toggle.url = (args: { demo_invite: string | number } | [demo_invite: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { demo_invite: args }
    }

    if (Array.isArray(args)) {
        args = {
            demo_invite: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        demo_invite: args.demo_invite,
    }

    return toggle.definition.url
            .replace('{demo_invite}', parsedArgs.demo_invite.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DemoInviteController::toggle
* @see app/Http/Controllers/Admin/DemoInviteController.php:54
* @route '/admin/demo-invites/{demo_invite}/toggle'
*/
toggle.post = (args: { demo_invite: string | number } | [demo_invite: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\DemoInviteController::toggle
* @see app/Http/Controllers/Admin/DemoInviteController.php:54
* @route '/admin/demo-invites/{demo_invite}/toggle'
*/
const toggleForm = (args: { demo_invite: string | number } | [demo_invite: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggle.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\DemoInviteController::toggle
* @see app/Http/Controllers/Admin/DemoInviteController.php:54
* @route '/admin/demo-invites/{demo_invite}/toggle'
*/
toggleForm.post = (args: { demo_invite: string | number } | [demo_invite: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggle.url(args, options),
    method: 'post',
})

toggle.form = toggleForm

const DemoInviteController = { index, store, update, destroy, toggle }

export default DemoInviteController