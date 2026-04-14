import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\WorkspaceController::index
* @see app/Http/Controllers/WorkspaceController.php:37
* @route '/workspaces'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/workspaces',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkspaceController::index
* @see app/Http/Controllers/WorkspaceController.php:37
* @route '/workspaces'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkspaceController::index
* @see app/Http/Controllers/WorkspaceController.php:37
* @route '/workspaces'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkspaceController::index
* @see app/Http/Controllers/WorkspaceController.php:37
* @route '/workspaces'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WorkspaceController::index
* @see app/Http/Controllers/WorkspaceController.php:37
* @route '/workspaces'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkspaceController::index
* @see app/Http/Controllers/WorkspaceController.php:37
* @route '/workspaces'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkspaceController::index
* @see app/Http/Controllers/WorkspaceController.php:37
* @route '/workspaces'
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
* @see \App\Http\Controllers\WorkspaceController::store
* @see app/Http/Controllers/WorkspaceController.php:55
* @route '/workspaces'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/workspaces',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WorkspaceController::store
* @see app/Http/Controllers/WorkspaceController.php:55
* @route '/workspaces'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkspaceController::store
* @see app/Http/Controllers/WorkspaceController.php:55
* @route '/workspaces'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkspaceController::store
* @see app/Http/Controllers/WorkspaceController.php:55
* @route '/workspaces'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkspaceController::store
* @see app/Http/Controllers/WorkspaceController.php:55
* @route '/workspaces'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\WorkspaceController::update
* @see app/Http/Controllers/WorkspaceController.php:71
* @route '/workspaces/{workspace}'
*/
export const update = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/workspaces/{workspace}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\WorkspaceController::update
* @see app/Http/Controllers/WorkspaceController.php:71
* @route '/workspaces/{workspace}'
*/
update.url = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workspace: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { workspace: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            workspace: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        workspace: typeof args.workspace === 'object'
        ? args.workspace.id
        : args.workspace,
    }

    return update.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkspaceController::update
* @see app/Http/Controllers/WorkspaceController.php:71
* @route '/workspaces/{workspace}'
*/
update.put = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\WorkspaceController::update
* @see app/Http/Controllers/WorkspaceController.php:71
* @route '/workspaces/{workspace}'
*/
const updateForm = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkspaceController::update
* @see app/Http/Controllers/WorkspaceController.php:71
* @route '/workspaces/{workspace}'
*/
updateForm.put = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\WorkspaceController::destroy
* @see app/Http/Controllers/WorkspaceController.php:157
* @route '/workspaces/{workspace}'
*/
export const destroy = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/workspaces/{workspace}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\WorkspaceController::destroy
* @see app/Http/Controllers/WorkspaceController.php:157
* @route '/workspaces/{workspace}'
*/
destroy.url = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workspace: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { workspace: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            workspace: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        workspace: typeof args.workspace === 'object'
        ? args.workspace.id
        : args.workspace,
    }

    return destroy.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkspaceController::destroy
* @see app/Http/Controllers/WorkspaceController.php:157
* @route '/workspaces/{workspace}'
*/
destroy.delete = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\WorkspaceController::destroy
* @see app/Http/Controllers/WorkspaceController.php:157
* @route '/workspaces/{workspace}'
*/
const destroyForm = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkspaceController::destroy
* @see app/Http/Controllers/WorkspaceController.php:157
* @route '/workspaces/{workspace}'
*/
destroyForm.delete = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\WorkspaceController::switchMethod
* @see app/Http/Controllers/WorkspaceController.php:104
* @route '/workspaces/{workspace}/switch'
*/
export const switchMethod = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: switchMethod.url(args, options),
    method: 'post',
})

switchMethod.definition = {
    methods: ["post"],
    url: '/workspaces/{workspace}/switch',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WorkspaceController::switchMethod
* @see app/Http/Controllers/WorkspaceController.php:104
* @route '/workspaces/{workspace}/switch'
*/
switchMethod.url = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workspace: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { workspace: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            workspace: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        workspace: typeof args.workspace === 'object'
        ? args.workspace.id
        : args.workspace,
    }

    return switchMethod.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkspaceController::switchMethod
* @see app/Http/Controllers/WorkspaceController.php:104
* @route '/workspaces/{workspace}/switch'
*/
switchMethod.post = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: switchMethod.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkspaceController::switchMethod
* @see app/Http/Controllers/WorkspaceController.php:104
* @route '/workspaces/{workspace}/switch'
*/
const switchMethodForm = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: switchMethod.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkspaceController::switchMethod
* @see app/Http/Controllers/WorkspaceController.php:104
* @route '/workspaces/{workspace}/switch'
*/
switchMethodForm.post = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: switchMethod.url(args, options),
    method: 'post',
})

switchMethod.form = switchMethodForm

/**
* @see \App\Http\Controllers\WorkspaceController::leave
* @see app/Http/Controllers/WorkspaceController.php:133
* @route '/workspaces/{workspace}/leave'
*/
export const leave = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: leave.url(args, options),
    method: 'post',
})

leave.definition = {
    methods: ["post"],
    url: '/workspaces/{workspace}/leave',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WorkspaceController::leave
* @see app/Http/Controllers/WorkspaceController.php:133
* @route '/workspaces/{workspace}/leave'
*/
leave.url = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workspace: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { workspace: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            workspace: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        workspace: typeof args.workspace === 'object'
        ? args.workspace.id
        : args.workspace,
    }

    return leave.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkspaceController::leave
* @see app/Http/Controllers/WorkspaceController.php:133
* @route '/workspaces/{workspace}/leave'
*/
leave.post = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: leave.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkspaceController::leave
* @see app/Http/Controllers/WorkspaceController.php:133
* @route '/workspaces/{workspace}/leave'
*/
const leaveForm = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: leave.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkspaceController::leave
* @see app/Http/Controllers/WorkspaceController.php:133
* @route '/workspaces/{workspace}/leave'
*/
leaveForm.post = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: leave.url(args, options),
    method: 'post',
})

leave.form = leaveForm

/**
* @see \App\Http\Controllers\WorkspaceController::removeMember
* @see app/Http/Controllers/WorkspaceController.php:117
* @route '/workspaces/{workspace}/members'
*/
export const removeMember = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeMember.url(args, options),
    method: 'delete',
})

removeMember.definition = {
    methods: ["delete"],
    url: '/workspaces/{workspace}/members',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\WorkspaceController::removeMember
* @see app/Http/Controllers/WorkspaceController.php:117
* @route '/workspaces/{workspace}/members'
*/
removeMember.url = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workspace: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { workspace: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            workspace: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        workspace: typeof args.workspace === 'object'
        ? args.workspace.id
        : args.workspace,
    }

    return removeMember.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkspaceController::removeMember
* @see app/Http/Controllers/WorkspaceController.php:117
* @route '/workspaces/{workspace}/members'
*/
removeMember.delete = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeMember.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\WorkspaceController::removeMember
* @see app/Http/Controllers/WorkspaceController.php:117
* @route '/workspaces/{workspace}/members'
*/
const removeMemberForm = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeMember.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkspaceController::removeMember
* @see app/Http/Controllers/WorkspaceController.php:117
* @route '/workspaces/{workspace}/members'
*/
removeMemberForm.delete = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeMember.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

removeMember.form = removeMemberForm

/**
* @see \App\Http\Controllers\WorkspaceController::updateMemberRole
* @see app/Http/Controllers/WorkspaceController.php:88
* @route '/workspaces/{workspace}/members/role'
*/
export const updateMemberRole = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateMemberRole.url(args, options),
    method: 'put',
})

updateMemberRole.definition = {
    methods: ["put"],
    url: '/workspaces/{workspace}/members/role',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\WorkspaceController::updateMemberRole
* @see app/Http/Controllers/WorkspaceController.php:88
* @route '/workspaces/{workspace}/members/role'
*/
updateMemberRole.url = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workspace: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { workspace: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            workspace: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        workspace: typeof args.workspace === 'object'
        ? args.workspace.id
        : args.workspace,
    }

    return updateMemberRole.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkspaceController::updateMemberRole
* @see app/Http/Controllers/WorkspaceController.php:88
* @route '/workspaces/{workspace}/members/role'
*/
updateMemberRole.put = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateMemberRole.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\WorkspaceController::updateMemberRole
* @see app/Http/Controllers/WorkspaceController.php:88
* @route '/workspaces/{workspace}/members/role'
*/
const updateMemberRoleForm = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateMemberRole.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkspaceController::updateMemberRole
* @see app/Http/Controllers/WorkspaceController.php:88
* @route '/workspaces/{workspace}/members/role'
*/
updateMemberRoleForm.put = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateMemberRole.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateMemberRole.form = updateMemberRoleForm

const WorkspaceController = { index, store, update, destroy, switchMethod, leave, removeMember, updateMemberRole, switch: switchMethod }

export default WorkspaceController