import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\BetaRequestController::request
* @see app/Http/Controllers/BetaRequestController.php:13
* @route '/beta/request'
*/
export const request = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: request.url(options),
    method: 'post',
})

request.definition = {
    methods: ["post"],
    url: '/beta/request',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BetaRequestController::request
* @see app/Http/Controllers/BetaRequestController.php:13
* @route '/beta/request'
*/
request.url = (options?: RouteQueryOptions) => {
    return request.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BetaRequestController::request
* @see app/Http/Controllers/BetaRequestController.php:13
* @route '/beta/request'
*/
request.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: request.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BetaRequestController::request
* @see app/Http/Controllers/BetaRequestController.php:13
* @route '/beta/request'
*/
const requestForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: request.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BetaRequestController::request
* @see app/Http/Controllers/BetaRequestController.php:13
* @route '/beta/request'
*/
requestForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: request.url(options),
    method: 'post',
})

request.form = requestForm

/**
* @see \App\Http\Controllers\Auth\BetaInvitationController::accept
* @see app/Http/Controllers/Auth/BetaInvitationController.php:42
* @route '/beta/accept/{token}'
*/
export const accept = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: accept.url(args, options),
    method: 'post',
})

accept.definition = {
    methods: ["post"],
    url: '/beta/accept/{token}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\BetaInvitationController::accept
* @see app/Http/Controllers/Auth/BetaInvitationController.php:42
* @route '/beta/accept/{token}'
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
* @see \App\Http\Controllers\Auth\BetaInvitationController::accept
* @see app/Http/Controllers/Auth/BetaInvitationController.php:42
* @route '/beta/accept/{token}'
*/
accept.post = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: accept.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\BetaInvitationController::accept
* @see app/Http/Controllers/Auth/BetaInvitationController.php:42
* @route '/beta/accept/{token}'
*/
const acceptForm = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: accept.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\BetaInvitationController::accept
* @see app/Http/Controllers/Auth/BetaInvitationController.php:42
* @route '/beta/accept/{token}'
*/
acceptForm.post = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: accept.url(args, options),
    method: 'post',
})

accept.form = acceptForm

const beta = {
    request: Object.assign(request, request),
    accept: Object.assign(accept, accept),
}

export default beta