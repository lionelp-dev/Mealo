import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\LocaleController::update
* @see app/Http/Controllers/Settings/LocaleController.php:14
* @route '/settings/locale'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/settings/locale',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Settings\LocaleController::update
* @see app/Http/Controllers/Settings/LocaleController.php:14
* @route '/settings/locale'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\LocaleController::update
* @see app/Http/Controllers/Settings/LocaleController.php:14
* @route '/settings/locale'
*/
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Settings\LocaleController::update
* @see app/Http/Controllers/Settings/LocaleController.php:14
* @route '/settings/locale'
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
* @see \App\Http\Controllers\Settings\LocaleController::update
* @see app/Http/Controllers/Settings/LocaleController.php:14
* @route '/settings/locale'
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

const locale = {
    update: Object.assign(update, update),
}

export default locale