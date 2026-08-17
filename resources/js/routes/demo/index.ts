import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\DemoController::enter
* @see app/Http/Controllers/DemoController.php:31
* @route '/demo/{token}'
*/
export const enter = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: enter.url(args, options),
    method: 'get',
})

enter.definition = {
    methods: ["get","head"],
    url: '/demo/{token}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DemoController::enter
* @see app/Http/Controllers/DemoController.php:31
* @route '/demo/{token}'
*/
enter.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return enter.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DemoController::enter
* @see app/Http/Controllers/DemoController.php:31
* @route '/demo/{token}'
*/
enter.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: enter.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DemoController::enter
* @see app/Http/Controllers/DemoController.php:31
* @route '/demo/{token}'
*/
enter.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: enter.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DemoController::enter
* @see app/Http/Controllers/DemoController.php:31
* @route '/demo/{token}'
*/
const enterForm = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: enter.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DemoController::enter
* @see app/Http/Controllers/DemoController.php:31
* @route '/demo/{token}'
*/
enterForm.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: enter.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DemoController::enter
* @see app/Http/Controllers/DemoController.php:31
* @route '/demo/{token}'
*/
enterForm.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: enter.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

enter.form = enterForm

/**
* @see \App\Http\Controllers\DemoController::reconnect
* @see app/Http/Controllers/DemoController.php:68
* @route '/demo/session/{demoToken}'
*/
export const reconnect = (args: { demoToken: string | number } | [demoToken: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reconnect.url(args, options),
    method: 'get',
})

reconnect.definition = {
    methods: ["get","head"],
    url: '/demo/session/{demoToken}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DemoController::reconnect
* @see app/Http/Controllers/DemoController.php:68
* @route '/demo/session/{demoToken}'
*/
reconnect.url = (args: { demoToken: string | number } | [demoToken: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { demoToken: args }
    }

    if (Array.isArray(args)) {
        args = {
            demoToken: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        demoToken: args.demoToken,
    }

    return reconnect.definition.url
            .replace('{demoToken}', parsedArgs.demoToken.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DemoController::reconnect
* @see app/Http/Controllers/DemoController.php:68
* @route '/demo/session/{demoToken}'
*/
reconnect.get = (args: { demoToken: string | number } | [demoToken: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reconnect.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DemoController::reconnect
* @see app/Http/Controllers/DemoController.php:68
* @route '/demo/session/{demoToken}'
*/
reconnect.head = (args: { demoToken: string | number } | [demoToken: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reconnect.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DemoController::reconnect
* @see app/Http/Controllers/DemoController.php:68
* @route '/demo/session/{demoToken}'
*/
const reconnectForm = (args: { demoToken: string | number } | [demoToken: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: reconnect.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DemoController::reconnect
* @see app/Http/Controllers/DemoController.php:68
* @route '/demo/session/{demoToken}'
*/
reconnectForm.get = (args: { demoToken: string | number } | [demoToken: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: reconnect.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DemoController::reconnect
* @see app/Http/Controllers/DemoController.php:68
* @route '/demo/session/{demoToken}'
*/
reconnectForm.head = (args: { demoToken: string | number } | [demoToken: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: reconnect.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

reconnect.form = reconnectForm

const demo = {
    enter: Object.assign(enter, enter),
    reconnect: Object.assign(reconnect, reconnect),
}

export default demo