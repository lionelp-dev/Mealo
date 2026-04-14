import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ShoppingListController::index
* @see app/Http/Controllers/ShoppingListController.php:26
* @route '/shopping-lists'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/shopping-lists',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ShoppingListController::index
* @see app/Http/Controllers/ShoppingListController.php:26
* @route '/shopping-lists'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ShoppingListController::index
* @see app/Http/Controllers/ShoppingListController.php:26
* @route '/shopping-lists'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ShoppingListController::index
* @see app/Http/Controllers/ShoppingListController.php:26
* @route '/shopping-lists'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ShoppingListController::index
* @see app/Http/Controllers/ShoppingListController.php:26
* @route '/shopping-lists'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ShoppingListController::index
* @see app/Http/Controllers/ShoppingListController.php:26
* @route '/shopping-lists'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ShoppingListController::index
* @see app/Http/Controllers/ShoppingListController.php:26
* @route '/shopping-lists'
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
* @see \App\Http\Controllers\ShoppingListController::update
* @see app/Http/Controllers/ShoppingListController.php:60
* @route '/shopping-lists'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/shopping-lists',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\ShoppingListController::update
* @see app/Http/Controllers/ShoppingListController.php:60
* @route '/shopping-lists'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ShoppingListController::update
* @see app/Http/Controllers/ShoppingListController.php:60
* @route '/shopping-lists'
*/
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\ShoppingListController::update
* @see app/Http/Controllers/ShoppingListController.php:60
* @route '/shopping-lists'
*/
const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ShoppingListController::update
* @see app/Http/Controllers/ShoppingListController.php:60
* @route '/shopping-lists'
*/
updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

const shoppingLists = {
    index: Object.assign(index, index),
    update: Object.assign(update, update),
}

export default shoppingLists