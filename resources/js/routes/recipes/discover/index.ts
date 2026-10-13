import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\RecipeController::pool
* @see app/Http/Controllers/RecipeController.php:297
* @route '/recipes/discover/pool'
*/
export const pool = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pool.url(options),
    method: 'post',
})

pool.definition = {
    methods: ["post"],
    url: '/recipes/discover/pool',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RecipeController::pool
* @see app/Http/Controllers/RecipeController.php:297
* @route '/recipes/discover/pool'
*/
pool.url = (options?: RouteQueryOptions) => {
    return pool.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecipeController::pool
* @see app/Http/Controllers/RecipeController.php:297
* @route '/recipes/discover/pool'
*/
pool.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pool.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RecipeController::pool
* @see app/Http/Controllers/RecipeController.php:297
* @route '/recipes/discover/pool'
*/
const poolForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: pool.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RecipeController::pool
* @see app/Http/Controllers/RecipeController.php:297
* @route '/recipes/discover/pool'
*/
poolForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: pool.url(options),
    method: 'post',
})

pool.form = poolForm

/**
* @see \App\Http\Controllers\RecipeController::status
* @see app/Http/Controllers/RecipeController.php:328
* @route '/recipes/discover/status/{discoveryId}'
*/
export const status = (args: { discoveryId: string | number } | [discoveryId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(args, options),
    method: 'get',
})

status.definition = {
    methods: ["get","head"],
    url: '/recipes/discover/status/{discoveryId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RecipeController::status
* @see app/Http/Controllers/RecipeController.php:328
* @route '/recipes/discover/status/{discoveryId}'
*/
status.url = (args: { discoveryId: string | number } | [discoveryId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { discoveryId: args }
    }

    if (Array.isArray(args)) {
        args = {
            discoveryId: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        discoveryId: args.discoveryId,
    }

    return status.definition.url
            .replace('{discoveryId}', parsedArgs.discoveryId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecipeController::status
* @see app/Http/Controllers/RecipeController.php:328
* @route '/recipes/discover/status/{discoveryId}'
*/
status.get = (args: { discoveryId: string | number } | [discoveryId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecipeController::status
* @see app/Http/Controllers/RecipeController.php:328
* @route '/recipes/discover/status/{discoveryId}'
*/
status.head = (args: { discoveryId: string | number } | [discoveryId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: status.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RecipeController::status
* @see app/Http/Controllers/RecipeController.php:328
* @route '/recipes/discover/status/{discoveryId}'
*/
const statusForm = (args: { discoveryId: string | number } | [discoveryId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: status.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecipeController::status
* @see app/Http/Controllers/RecipeController.php:328
* @route '/recipes/discover/status/{discoveryId}'
*/
statusForm.get = (args: { discoveryId: string | number } | [discoveryId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: status.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecipeController::status
* @see app/Http/Controllers/RecipeController.php:328
* @route '/recipes/discover/status/{discoveryId}'
*/
statusForm.head = (args: { discoveryId: string | number } | [discoveryId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: status.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

status.form = statusForm

/**
* @see \App\Http\Controllers\RecipeController::save
* @see app/Http/Controllers/RecipeController.php:341
* @route '/recipes/discover/save'
*/
export const save = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: save.url(options),
    method: 'post',
})

save.definition = {
    methods: ["post"],
    url: '/recipes/discover/save',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RecipeController::save
* @see app/Http/Controllers/RecipeController.php:341
* @route '/recipes/discover/save'
*/
save.url = (options?: RouteQueryOptions) => {
    return save.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecipeController::save
* @see app/Http/Controllers/RecipeController.php:341
* @route '/recipes/discover/save'
*/
save.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: save.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RecipeController::save
* @see app/Http/Controllers/RecipeController.php:341
* @route '/recipes/discover/save'
*/
const saveForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: save.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RecipeController::save
* @see app/Http/Controllers/RecipeController.php:341
* @route '/recipes/discover/save'
*/
saveForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: save.url(options),
    method: 'post',
})

save.form = saveForm

const discover = {
    pool: Object.assign(pool, pool),
    status: Object.assign(status, status),
    save: Object.assign(save, save),
}

export default discover