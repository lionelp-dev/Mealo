import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BetaRequestController::store
* @see app/Http/Controllers/BetaRequestController.php:13
* @route '/beta/request'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/beta/request',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BetaRequestController::store
* @see app/Http/Controllers/BetaRequestController.php:13
* @route '/beta/request'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BetaRequestController::store
* @see app/Http/Controllers/BetaRequestController.php:13
* @route '/beta/request'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BetaRequestController::store
* @see app/Http/Controllers/BetaRequestController.php:13
* @route '/beta/request'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BetaRequestController::store
* @see app/Http/Controllers/BetaRequestController.php:13
* @route '/beta/request'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const BetaRequestController = { store }

export default BetaRequestController