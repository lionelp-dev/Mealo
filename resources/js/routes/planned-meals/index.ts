import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\PlannedMealController::index
* @see app/Http/Controllers/PlannedMealController.php:37
* @route '/planned-meals'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/planned-meals',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PlannedMealController::index
* @see app/Http/Controllers/PlannedMealController.php:37
* @route '/planned-meals'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlannedMealController::index
* @see app/Http/Controllers/PlannedMealController.php:37
* @route '/planned-meals'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlannedMealController::index
* @see app/Http/Controllers/PlannedMealController.php:37
* @route '/planned-meals'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PlannedMealController::index
* @see app/Http/Controllers/PlannedMealController.php:37
* @route '/planned-meals'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlannedMealController::index
* @see app/Http/Controllers/PlannedMealController.php:37
* @route '/planned-meals'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlannedMealController::index
* @see app/Http/Controllers/PlannedMealController.php:37
* @route '/planned-meals'
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
* @see \App\Http\Controllers\PlannedMealController::create
* @see app/Http/Controllers/PlannedMealController.php:127
* @route '/planned-meals/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/planned-meals/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PlannedMealController::create
* @see app/Http/Controllers/PlannedMealController.php:127
* @route '/planned-meals/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlannedMealController::create
* @see app/Http/Controllers/PlannedMealController.php:127
* @route '/planned-meals/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlannedMealController::create
* @see app/Http/Controllers/PlannedMealController.php:127
* @route '/planned-meals/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PlannedMealController::create
* @see app/Http/Controllers/PlannedMealController.php:127
* @route '/planned-meals/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlannedMealController::create
* @see app/Http/Controllers/PlannedMealController.php:127
* @route '/planned-meals/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlannedMealController::create
* @see app/Http/Controllers/PlannedMealController.php:127
* @route '/planned-meals/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\PlannedMealController::store
* @see app/Http/Controllers/PlannedMealController.php:182
* @route '/planned-meals'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/planned-meals',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PlannedMealController::store
* @see app/Http/Controllers/PlannedMealController.php:182
* @route '/planned-meals'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlannedMealController::store
* @see app/Http/Controllers/PlannedMealController.php:182
* @route '/planned-meals'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlannedMealController::store
* @see app/Http/Controllers/PlannedMealController.php:182
* @route '/planned-meals'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlannedMealController::store
* @see app/Http/Controllers/PlannedMealController.php:182
* @route '/planned-meals'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\PlannedMealController::show
* @see app/Http/Controllers/PlannedMealController.php:135
* @route '/planned-meals/{planned_meal}'
*/
export const show = (args: { planned_meal: string | number } | [planned_meal: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/planned-meals/{planned_meal}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PlannedMealController::show
* @see app/Http/Controllers/PlannedMealController.php:135
* @route '/planned-meals/{planned_meal}'
*/
show.url = (args: { planned_meal: string | number } | [planned_meal: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { planned_meal: args }
    }

    if (Array.isArray(args)) {
        args = {
            planned_meal: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        planned_meal: args.planned_meal,
    }

    return show.definition.url
            .replace('{planned_meal}', parsedArgs.planned_meal.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlannedMealController::show
* @see app/Http/Controllers/PlannedMealController.php:135
* @route '/planned-meals/{planned_meal}'
*/
show.get = (args: { planned_meal: string | number } | [planned_meal: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlannedMealController::show
* @see app/Http/Controllers/PlannedMealController.php:135
* @route '/planned-meals/{planned_meal}'
*/
show.head = (args: { planned_meal: string | number } | [planned_meal: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PlannedMealController::show
* @see app/Http/Controllers/PlannedMealController.php:135
* @route '/planned-meals/{planned_meal}'
*/
const showForm = (args: { planned_meal: string | number } | [planned_meal: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlannedMealController::show
* @see app/Http/Controllers/PlannedMealController.php:135
* @route '/planned-meals/{planned_meal}'
*/
showForm.get = (args: { planned_meal: string | number } | [planned_meal: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlannedMealController::show
* @see app/Http/Controllers/PlannedMealController.php:135
* @route '/planned-meals/{planned_meal}'
*/
showForm.head = (args: { planned_meal: string | number } | [planned_meal: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\PlannedMealController::edit
* @see app/Http/Controllers/PlannedMealController.php:145
* @route '/planned-meals/{planned_meal}/edit'
*/
export const edit = (args: { planned_meal: string | number } | [planned_meal: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/planned-meals/{planned_meal}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PlannedMealController::edit
* @see app/Http/Controllers/PlannedMealController.php:145
* @route '/planned-meals/{planned_meal}/edit'
*/
edit.url = (args: { planned_meal: string | number } | [planned_meal: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { planned_meal: args }
    }

    if (Array.isArray(args)) {
        args = {
            planned_meal: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        planned_meal: args.planned_meal,
    }

    return edit.definition.url
            .replace('{planned_meal}', parsedArgs.planned_meal.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlannedMealController::edit
* @see app/Http/Controllers/PlannedMealController.php:145
* @route '/planned-meals/{planned_meal}/edit'
*/
edit.get = (args: { planned_meal: string | number } | [planned_meal: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlannedMealController::edit
* @see app/Http/Controllers/PlannedMealController.php:145
* @route '/planned-meals/{planned_meal}/edit'
*/
edit.head = (args: { planned_meal: string | number } | [planned_meal: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PlannedMealController::edit
* @see app/Http/Controllers/PlannedMealController.php:145
* @route '/planned-meals/{planned_meal}/edit'
*/
const editForm = (args: { planned_meal: string | number } | [planned_meal: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlannedMealController::edit
* @see app/Http/Controllers/PlannedMealController.php:145
* @route '/planned-meals/{planned_meal}/edit'
*/
editForm.get = (args: { planned_meal: string | number } | [planned_meal: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlannedMealController::edit
* @see app/Http/Controllers/PlannedMealController.php:145
* @route '/planned-meals/{planned_meal}/edit'
*/
editForm.head = (args: { planned_meal: string | number } | [planned_meal: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\PlannedMealController::update
* @see app/Http/Controllers/PlannedMealController.php:153
* @route '/planned-meals/{planned_meal}'
*/
export const update = (args: { planned_meal: string | number } | [planned_meal: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/planned-meals/{planned_meal}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\PlannedMealController::update
* @see app/Http/Controllers/PlannedMealController.php:153
* @route '/planned-meals/{planned_meal}'
*/
update.url = (args: { planned_meal: string | number } | [planned_meal: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { planned_meal: args }
    }

    if (Array.isArray(args)) {
        args = {
            planned_meal: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        planned_meal: args.planned_meal,
    }

    return update.definition.url
            .replace('{planned_meal}', parsedArgs.planned_meal.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlannedMealController::update
* @see app/Http/Controllers/PlannedMealController.php:153
* @route '/planned-meals/{planned_meal}'
*/
update.put = (args: { planned_meal: string | number } | [planned_meal: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\PlannedMealController::update
* @see app/Http/Controllers/PlannedMealController.php:153
* @route '/planned-meals/{planned_meal}'
*/
update.patch = (args: { planned_meal: string | number } | [planned_meal: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\PlannedMealController::update
* @see app/Http/Controllers/PlannedMealController.php:153
* @route '/planned-meals/{planned_meal}'
*/
const updateForm = (args: { planned_meal: string | number } | [planned_meal: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlannedMealController::update
* @see app/Http/Controllers/PlannedMealController.php:153
* @route '/planned-meals/{planned_meal}'
*/
updateForm.put = (args: { planned_meal: string | number } | [planned_meal: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlannedMealController::update
* @see app/Http/Controllers/PlannedMealController.php:153
* @route '/planned-meals/{planned_meal}'
*/
updateForm.patch = (args: { planned_meal: string | number } | [planned_meal: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\PlannedMealController::destroy
* @see app/Http/Controllers/PlannedMealController.php:234
* @route '/planned-meals'
*/
export const destroy = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/planned-meals',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PlannedMealController::destroy
* @see app/Http/Controllers/PlannedMealController.php:234
* @route '/planned-meals'
*/
destroy.url = (options?: RouteQueryOptions) => {
    return destroy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlannedMealController::destroy
* @see app/Http/Controllers/PlannedMealController.php:234
* @route '/planned-meals'
*/
destroy.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\PlannedMealController::destroy
* @see app/Http/Controllers/PlannedMealController.php:234
* @route '/planned-meals'
*/
const destroyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlannedMealController::destroy
* @see app/Http/Controllers/PlannedMealController.php:234
* @route '/planned-meals'
*/
destroyForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\PlannedMealController::generate
* @see app/Http/Controllers/PlannedMealController.php:282
* @route '/planned-meals/generate'
*/
export const generate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generate.url(options),
    method: 'post',
})

generate.definition = {
    methods: ["post"],
    url: '/planned-meals/generate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PlannedMealController::generate
* @see app/Http/Controllers/PlannedMealController.php:282
* @route '/planned-meals/generate'
*/
generate.url = (options?: RouteQueryOptions) => {
    return generate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlannedMealController::generate
* @see app/Http/Controllers/PlannedMealController.php:282
* @route '/planned-meals/generate'
*/
generate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generate.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlannedMealController::generate
* @see app/Http/Controllers/PlannedMealController.php:282
* @route '/planned-meals/generate'
*/
const generateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: generate.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlannedMealController::generate
* @see app/Http/Controllers/PlannedMealController.php:282
* @route '/planned-meals/generate'
*/
generateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: generate.url(options),
    method: 'post',
})

generate.form = generateForm

const plannedMeals = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    generate: Object.assign(generate, generate),
}

export default plannedMeals