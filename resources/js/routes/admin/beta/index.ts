import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\BetaManagementController::index
* @see app/Http/Controllers/Admin/BetaManagementController.php:25
* @route '/admin/beta-requests'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/beta-requests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\BetaManagementController::index
* @see app/Http/Controllers/Admin/BetaManagementController.php:25
* @route '/admin/beta-requests'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BetaManagementController::index
* @see app/Http/Controllers/Admin/BetaManagementController.php:25
* @route '/admin/beta-requests'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\BetaManagementController::index
* @see app/Http/Controllers/Admin/BetaManagementController.php:25
* @route '/admin/beta-requests'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\BetaManagementController::index
* @see app/Http/Controllers/Admin/BetaManagementController.php:25
* @route '/admin/beta-requests'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\BetaManagementController::index
* @see app/Http/Controllers/Admin/BetaManagementController.php:25
* @route '/admin/beta-requests'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\BetaManagementController::index
* @see app/Http/Controllers/Admin/BetaManagementController.php:25
* @route '/admin/beta-requests'
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
* @see \App\Http\Controllers\Admin\BetaManagementController::approve
* @see app/Http/Controllers/Admin/BetaManagementController.php:67
* @route '/admin/beta-requests/{betaRequest}/approve'
*/
export const approve = (args: { betaRequest: string | number | { id: string | number } } | [betaRequest: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/admin/beta-requests/{betaRequest}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\BetaManagementController::approve
* @see app/Http/Controllers/Admin/BetaManagementController.php:67
* @route '/admin/beta-requests/{betaRequest}/approve'
*/
approve.url = (args: { betaRequest: string | number | { id: string | number } } | [betaRequest: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { betaRequest: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { betaRequest: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            betaRequest: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        betaRequest: typeof args.betaRequest === 'object'
        ? args.betaRequest.id
        : args.betaRequest,
    }

    return approve.definition.url
            .replace('{betaRequest}', parsedArgs.betaRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BetaManagementController::approve
* @see app/Http/Controllers/Admin/BetaManagementController.php:67
* @route '/admin/beta-requests/{betaRequest}/approve'
*/
approve.post = (args: { betaRequest: string | number | { id: string | number } } | [betaRequest: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BetaManagementController::approve
* @see app/Http/Controllers/Admin/BetaManagementController.php:67
* @route '/admin/beta-requests/{betaRequest}/approve'
*/
const approveForm = (args: { betaRequest: string | number | { id: string | number } } | [betaRequest: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BetaManagementController::approve
* @see app/Http/Controllers/Admin/BetaManagementController.php:67
* @route '/admin/beta-requests/{betaRequest}/approve'
*/
approveForm.post = (args: { betaRequest: string | number | { id: string | number } } | [betaRequest: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
})

approve.form = approveForm

/**
* @see \App\Http\Controllers\Admin\BetaManagementController::reject
* @see app/Http/Controllers/Admin/BetaManagementController.php:88
* @route '/admin/beta-requests/{betaRequest}/reject'
*/
export const reject = (args: { betaRequest: string | number | { id: string | number } } | [betaRequest: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/admin/beta-requests/{betaRequest}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\BetaManagementController::reject
* @see app/Http/Controllers/Admin/BetaManagementController.php:88
* @route '/admin/beta-requests/{betaRequest}/reject'
*/
reject.url = (args: { betaRequest: string | number | { id: string | number } } | [betaRequest: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { betaRequest: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { betaRequest: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            betaRequest: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        betaRequest: typeof args.betaRequest === 'object'
        ? args.betaRequest.id
        : args.betaRequest,
    }

    return reject.definition.url
            .replace('{betaRequest}', parsedArgs.betaRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BetaManagementController::reject
* @see app/Http/Controllers/Admin/BetaManagementController.php:88
* @route '/admin/beta-requests/{betaRequest}/reject'
*/
reject.post = (args: { betaRequest: string | number | { id: string | number } } | [betaRequest: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BetaManagementController::reject
* @see app/Http/Controllers/Admin/BetaManagementController.php:88
* @route '/admin/beta-requests/{betaRequest}/reject'
*/
const rejectForm = (args: { betaRequest: string | number | { id: string | number } } | [betaRequest: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BetaManagementController::reject
* @see app/Http/Controllers/Admin/BetaManagementController.php:88
* @route '/admin/beta-requests/{betaRequest}/reject'
*/
rejectForm.post = (args: { betaRequest: string | number | { id: string | number } } | [betaRequest: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reject.url(args, options),
    method: 'post',
})

reject.form = rejectForm

/**
* @see \App\Http\Controllers\Admin\BetaManagementController::resend
* @see app/Http/Controllers/Admin/BetaManagementController.php:104
* @route '/admin/beta-requests/{betaRequest}/resend'
*/
export const resend = (args: { betaRequest: string | number | { id: string | number } } | [betaRequest: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resend.url(args, options),
    method: 'post',
})

resend.definition = {
    methods: ["post"],
    url: '/admin/beta-requests/{betaRequest}/resend',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\BetaManagementController::resend
* @see app/Http/Controllers/Admin/BetaManagementController.php:104
* @route '/admin/beta-requests/{betaRequest}/resend'
*/
resend.url = (args: { betaRequest: string | number | { id: string | number } } | [betaRequest: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { betaRequest: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { betaRequest: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            betaRequest: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        betaRequest: typeof args.betaRequest === 'object'
        ? args.betaRequest.id
        : args.betaRequest,
    }

    return resend.definition.url
            .replace('{betaRequest}', parsedArgs.betaRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BetaManagementController::resend
* @see app/Http/Controllers/Admin/BetaManagementController.php:104
* @route '/admin/beta-requests/{betaRequest}/resend'
*/
resend.post = (args: { betaRequest: string | number | { id: string | number } } | [betaRequest: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resend.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BetaManagementController::resend
* @see app/Http/Controllers/Admin/BetaManagementController.php:104
* @route '/admin/beta-requests/{betaRequest}/resend'
*/
const resendForm = (args: { betaRequest: string | number | { id: string | number } } | [betaRequest: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resend.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BetaManagementController::resend
* @see app/Http/Controllers/Admin/BetaManagementController.php:104
* @route '/admin/beta-requests/{betaRequest}/resend'
*/
resendForm.post = (args: { betaRequest: string | number | { id: string | number } } | [betaRequest: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resend.url(args, options),
    method: 'post',
})

resend.form = resendForm

/**
* @see \App\Http\Controllers\Admin\BetaManagementController::cleanupAll
* @see app/Http/Controllers/Admin/BetaManagementController.php:127
* @route '/admin/beta-requests/cleanup-all'
*/
export const cleanupAll = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cleanupAll.url(options),
    method: 'post',
})

cleanupAll.definition = {
    methods: ["post"],
    url: '/admin/beta-requests/cleanup-all',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\BetaManagementController::cleanupAll
* @see app/Http/Controllers/Admin/BetaManagementController.php:127
* @route '/admin/beta-requests/cleanup-all'
*/
cleanupAll.url = (options?: RouteQueryOptions) => {
    return cleanupAll.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BetaManagementController::cleanupAll
* @see app/Http/Controllers/Admin/BetaManagementController.php:127
* @route '/admin/beta-requests/cleanup-all'
*/
cleanupAll.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cleanupAll.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BetaManagementController::cleanupAll
* @see app/Http/Controllers/Admin/BetaManagementController.php:127
* @route '/admin/beta-requests/cleanup-all'
*/
const cleanupAllForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cleanupAll.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BetaManagementController::cleanupAll
* @see app/Http/Controllers/Admin/BetaManagementController.php:127
* @route '/admin/beta-requests/cleanup-all'
*/
cleanupAllForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cleanupAll.url(options),
    method: 'post',
})

cleanupAll.form = cleanupAllForm

const beta = {
    index: Object.assign(index, index),
    approve: Object.assign(approve, approve),
    reject: Object.assign(reject, reject),
    resend: Object.assign(resend, resend),
    cleanupAll: Object.assign(cleanupAll, cleanupAll),
}

export default beta