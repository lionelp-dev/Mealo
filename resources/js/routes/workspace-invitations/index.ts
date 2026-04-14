import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\WorkspaceInvitationController::index
* @see app/Http/Controllers/WorkspaceInvitationController.php:35
* @route '/workspace-invitations'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/workspace-invitations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkspaceInvitationController::index
* @see app/Http/Controllers/WorkspaceInvitationController.php:35
* @route '/workspace-invitations'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkspaceInvitationController::index
* @see app/Http/Controllers/WorkspaceInvitationController.php:35
* @route '/workspace-invitations'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkspaceInvitationController::index
* @see app/Http/Controllers/WorkspaceInvitationController.php:35
* @route '/workspace-invitations'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WorkspaceInvitationController::index
* @see app/Http/Controllers/WorkspaceInvitationController.php:35
* @route '/workspace-invitations'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkspaceInvitationController::index
* @see app/Http/Controllers/WorkspaceInvitationController.php:35
* @route '/workspace-invitations'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkspaceInvitationController::index
* @see app/Http/Controllers/WorkspaceInvitationController.php:35
* @route '/workspace-invitations'
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
* @see \App\Http\Controllers\WorkspaceInvitationController::store
* @see app/Http/Controllers/WorkspaceInvitationController.php:51
* @route '/workspaces/{workspace_id}/invitations'
*/
export const store = (args: { workspace_id: string | number } | [workspace_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/workspaces/{workspace_id}/invitations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WorkspaceInvitationController::store
* @see app/Http/Controllers/WorkspaceInvitationController.php:51
* @route '/workspaces/{workspace_id}/invitations'
*/
store.url = (args: { workspace_id: string | number } | [workspace_id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workspace_id: args }
    }

    if (Array.isArray(args)) {
        args = {
            workspace_id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        workspace_id: args.workspace_id,
    }

    return store.definition.url
            .replace('{workspace_id}', parsedArgs.workspace_id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkspaceInvitationController::store
* @see app/Http/Controllers/WorkspaceInvitationController.php:51
* @route '/workspaces/{workspace_id}/invitations'
*/
store.post = (args: { workspace_id: string | number } | [workspace_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkspaceInvitationController::store
* @see app/Http/Controllers/WorkspaceInvitationController.php:51
* @route '/workspaces/{workspace_id}/invitations'
*/
const storeForm = (args: { workspace_id: string | number } | [workspace_id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkspaceInvitationController::store
* @see app/Http/Controllers/WorkspaceInvitationController.php:51
* @route '/workspaces/{workspace_id}/invitations'
*/
storeForm.post = (args: { workspace_id: string | number } | [workspace_id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\WorkspaceInvitationController::destroy
* @see app/Http/Controllers/WorkspaceInvitationController.php:144
* @route '/workspace-invitations/{invitation}'
*/
export const destroy = (args: { invitation: string | number | { id: string | number } } | [invitation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/workspace-invitations/{invitation}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\WorkspaceInvitationController::destroy
* @see app/Http/Controllers/WorkspaceInvitationController.php:144
* @route '/workspace-invitations/{invitation}'
*/
destroy.url = (args: { invitation: string | number | { id: string | number } } | [invitation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invitation: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { invitation: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            invitation: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        invitation: typeof args.invitation === 'object'
        ? args.invitation.id
        : args.invitation,
    }

    return destroy.definition.url
            .replace('{invitation}', parsedArgs.invitation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkspaceInvitationController::destroy
* @see app/Http/Controllers/WorkspaceInvitationController.php:144
* @route '/workspace-invitations/{invitation}'
*/
destroy.delete = (args: { invitation: string | number | { id: string | number } } | [invitation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\WorkspaceInvitationController::destroy
* @see app/Http/Controllers/WorkspaceInvitationController.php:144
* @route '/workspace-invitations/{invitation}'
*/
const destroyForm = (args: { invitation: string | number | { id: string | number } } | [invitation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkspaceInvitationController::destroy
* @see app/Http/Controllers/WorkspaceInvitationController.php:144
* @route '/workspace-invitations/{invitation}'
*/
destroyForm.delete = (args: { invitation: string | number | { id: string | number } } | [invitation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\WorkspaceInvitationController::accept
* @see app/Http/Controllers/WorkspaceInvitationController.php:75
* @route '/workspace-invitations/{token}/accept'
*/
export const accept = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: accept.url(args, options),
    method: 'post',
})

accept.definition = {
    methods: ["post"],
    url: '/workspace-invitations/{token}/accept',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WorkspaceInvitationController::accept
* @see app/Http/Controllers/WorkspaceInvitationController.php:75
* @route '/workspace-invitations/{token}/accept'
*/
accept.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { token: args }
    }

    if (Array.isArray(args)) {
        args = {
            token: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        token: args.token,
    }

    return accept.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkspaceInvitationController::accept
* @see app/Http/Controllers/WorkspaceInvitationController.php:75
* @route '/workspace-invitations/{token}/accept'
*/
accept.post = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: accept.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkspaceInvitationController::accept
* @see app/Http/Controllers/WorkspaceInvitationController.php:75
* @route '/workspace-invitations/{token}/accept'
*/
const acceptForm = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: accept.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkspaceInvitationController::accept
* @see app/Http/Controllers/WorkspaceInvitationController.php:75
* @route '/workspace-invitations/{token}/accept'
*/
acceptForm.post = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: accept.url(args, options),
    method: 'post',
})

accept.form = acceptForm

/**
* @see \App\Http\Controllers\WorkspaceInvitationController::decline
* @see app/Http/Controllers/WorkspaceInvitationController.php:125
* @route '/workspace-invitations/{token}/decline'
*/
export const decline = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: decline.url(args, options),
    method: 'post',
})

decline.definition = {
    methods: ["post"],
    url: '/workspace-invitations/{token}/decline',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WorkspaceInvitationController::decline
* @see app/Http/Controllers/WorkspaceInvitationController.php:125
* @route '/workspace-invitations/{token}/decline'
*/
decline.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { token: args }
    }

    if (Array.isArray(args)) {
        args = {
            token: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        token: args.token,
    }

    return decline.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkspaceInvitationController::decline
* @see app/Http/Controllers/WorkspaceInvitationController.php:125
* @route '/workspace-invitations/{token}/decline'
*/
decline.post = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: decline.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkspaceInvitationController::decline
* @see app/Http/Controllers/WorkspaceInvitationController.php:125
* @route '/workspace-invitations/{token}/decline'
*/
const declineForm = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: decline.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkspaceInvitationController::decline
* @see app/Http/Controllers/WorkspaceInvitationController.php:125
* @route '/workspace-invitations/{token}/decline'
*/
declineForm.post = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: decline.url(args, options),
    method: 'post',
})

decline.form = declineForm

/**
* @see \App\Http\Controllers\WorkspaceInvitationController::acceptFromEmail
* @see app/Http/Controllers/WorkspaceInvitationController.php:97
* @route '/workspace-invitations/{token}/accept'
*/
export const acceptFromEmail = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: acceptFromEmail.url(args, options),
    method: 'get',
})

acceptFromEmail.definition = {
    methods: ["get","head"],
    url: '/workspace-invitations/{token}/accept',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkspaceInvitationController::acceptFromEmail
* @see app/Http/Controllers/WorkspaceInvitationController.php:97
* @route '/workspace-invitations/{token}/accept'
*/
acceptFromEmail.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { token: args }
    }

    if (Array.isArray(args)) {
        args = {
            token: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        token: args.token,
    }

    return acceptFromEmail.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkspaceInvitationController::acceptFromEmail
* @see app/Http/Controllers/WorkspaceInvitationController.php:97
* @route '/workspace-invitations/{token}/accept'
*/
acceptFromEmail.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: acceptFromEmail.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkspaceInvitationController::acceptFromEmail
* @see app/Http/Controllers/WorkspaceInvitationController.php:97
* @route '/workspace-invitations/{token}/accept'
*/
acceptFromEmail.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: acceptFromEmail.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WorkspaceInvitationController::acceptFromEmail
* @see app/Http/Controllers/WorkspaceInvitationController.php:97
* @route '/workspace-invitations/{token}/accept'
*/
const acceptFromEmailForm = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: acceptFromEmail.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkspaceInvitationController::acceptFromEmail
* @see app/Http/Controllers/WorkspaceInvitationController.php:97
* @route '/workspace-invitations/{token}/accept'
*/
acceptFromEmailForm.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: acceptFromEmail.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkspaceInvitationController::acceptFromEmail
* @see app/Http/Controllers/WorkspaceInvitationController.php:97
* @route '/workspace-invitations/{token}/accept'
*/
acceptFromEmailForm.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: acceptFromEmail.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

acceptFromEmail.form = acceptFromEmailForm

const workspaceInvitations = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    destroy: Object.assign(destroy, destroy),
    accept: Object.assign(accept, accept),
    decline: Object.assign(decline, decline),
    acceptFromEmail: Object.assign(acceptFromEmail, acceptFromEmail),
}

export default workspaceInvitations