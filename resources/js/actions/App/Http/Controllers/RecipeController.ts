import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\RecipeController::index
* @see app/Http/Controllers/RecipeController.php:40
* @route '/recipes'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/recipes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RecipeController::index
* @see app/Http/Controllers/RecipeController.php:40
* @route '/recipes'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecipeController::index
* @see app/Http/Controllers/RecipeController.php:40
* @route '/recipes'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecipeController::index
* @see app/Http/Controllers/RecipeController.php:40
* @route '/recipes'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RecipeController::index
* @see app/Http/Controllers/RecipeController.php:40
* @route '/recipes'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecipeController::index
* @see app/Http/Controllers/RecipeController.php:40
* @route '/recipes'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecipeController::index
* @see app/Http/Controllers/RecipeController.php:40
* @route '/recipes'
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
* @see \App\Http\Controllers\RecipeController::create
* @see app/Http/Controllers/RecipeController.php:63
* @route '/recipes/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/recipes/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RecipeController::create
* @see app/Http/Controllers/RecipeController.php:63
* @route '/recipes/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecipeController::create
* @see app/Http/Controllers/RecipeController.php:63
* @route '/recipes/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecipeController::create
* @see app/Http/Controllers/RecipeController.php:63
* @route '/recipes/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RecipeController::create
* @see app/Http/Controllers/RecipeController.php:63
* @route '/recipes/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecipeController::create
* @see app/Http/Controllers/RecipeController.php:63
* @route '/recipes/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecipeController::create
* @see app/Http/Controllers/RecipeController.php:63
* @route '/recipes/create'
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
* @see \App\Http\Controllers\RecipeController::store
* @see app/Http/Controllers/RecipeController.php:91
* @route '/recipes'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/recipes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RecipeController::store
* @see app/Http/Controllers/RecipeController.php:91
* @route '/recipes'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecipeController::store
* @see app/Http/Controllers/RecipeController.php:91
* @route '/recipes'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RecipeController::store
* @see app/Http/Controllers/RecipeController.php:91
* @route '/recipes'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RecipeController::store
* @see app/Http/Controllers/RecipeController.php:91
* @route '/recipes'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\RecipeController::show
* @see app/Http/Controllers/RecipeController.php:149
* @route '/recipes/{recipe}'
*/
export const show = (args: { recipe: string | { id: string } } | [recipe: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/recipes/{recipe}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RecipeController::show
* @see app/Http/Controllers/RecipeController.php:149
* @route '/recipes/{recipe}'
*/
show.url = (args: { recipe: string | { id: string } } | [recipe: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { recipe: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { recipe: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            recipe: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        recipe: typeof args.recipe === 'object'
        ? args.recipe.id
        : args.recipe,
    }

    return show.definition.url
            .replace('{recipe}', parsedArgs.recipe.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecipeController::show
* @see app/Http/Controllers/RecipeController.php:149
* @route '/recipes/{recipe}'
*/
show.get = (args: { recipe: string | { id: string } } | [recipe: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecipeController::show
* @see app/Http/Controllers/RecipeController.php:149
* @route '/recipes/{recipe}'
*/
show.head = (args: { recipe: string | { id: string } } | [recipe: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RecipeController::show
* @see app/Http/Controllers/RecipeController.php:149
* @route '/recipes/{recipe}'
*/
const showForm = (args: { recipe: string | { id: string } } | [recipe: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecipeController::show
* @see app/Http/Controllers/RecipeController.php:149
* @route '/recipes/{recipe}'
*/
showForm.get = (args: { recipe: string | { id: string } } | [recipe: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecipeController::show
* @see app/Http/Controllers/RecipeController.php:149
* @route '/recipes/{recipe}'
*/
showForm.head = (args: { recipe: string | { id: string } } | [recipe: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\RecipeController::edit
* @see app/Http/Controllers/RecipeController.php:163
* @route '/recipes/{recipe}/edit'
*/
export const edit = (args: { recipe: string | { id: string } } | [recipe: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/recipes/{recipe}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RecipeController::edit
* @see app/Http/Controllers/RecipeController.php:163
* @route '/recipes/{recipe}/edit'
*/
edit.url = (args: { recipe: string | { id: string } } | [recipe: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { recipe: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { recipe: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            recipe: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        recipe: typeof args.recipe === 'object'
        ? args.recipe.id
        : args.recipe,
    }

    return edit.definition.url
            .replace('{recipe}', parsedArgs.recipe.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecipeController::edit
* @see app/Http/Controllers/RecipeController.php:163
* @route '/recipes/{recipe}/edit'
*/
edit.get = (args: { recipe: string | { id: string } } | [recipe: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecipeController::edit
* @see app/Http/Controllers/RecipeController.php:163
* @route '/recipes/{recipe}/edit'
*/
edit.head = (args: { recipe: string | { id: string } } | [recipe: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RecipeController::edit
* @see app/Http/Controllers/RecipeController.php:163
* @route '/recipes/{recipe}/edit'
*/
const editForm = (args: { recipe: string | { id: string } } | [recipe: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecipeController::edit
* @see app/Http/Controllers/RecipeController.php:163
* @route '/recipes/{recipe}/edit'
*/
editForm.get = (args: { recipe: string | { id: string } } | [recipe: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecipeController::edit
* @see app/Http/Controllers/RecipeController.php:163
* @route '/recipes/{recipe}/edit'
*/
editForm.head = (args: { recipe: string | { id: string } } | [recipe: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\RecipeController::update
* @see app/Http/Controllers/RecipeController.php:191
* @route '/recipes/{recipe}'
*/
export const update = (args: { recipe: string | { id: string } } | [recipe: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/recipes/{recipe}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\RecipeController::update
* @see app/Http/Controllers/RecipeController.php:191
* @route '/recipes/{recipe}'
*/
update.url = (args: { recipe: string | { id: string } } | [recipe: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { recipe: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { recipe: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            recipe: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        recipe: typeof args.recipe === 'object'
        ? args.recipe.id
        : args.recipe,
    }

    return update.definition.url
            .replace('{recipe}', parsedArgs.recipe.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecipeController::update
* @see app/Http/Controllers/RecipeController.php:191
* @route '/recipes/{recipe}'
*/
update.put = (args: { recipe: string | { id: string } } | [recipe: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\RecipeController::update
* @see app/Http/Controllers/RecipeController.php:191
* @route '/recipes/{recipe}'
*/
update.patch = (args: { recipe: string | { id: string } } | [recipe: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\RecipeController::update
* @see app/Http/Controllers/RecipeController.php:191
* @route '/recipes/{recipe}'
*/
const updateForm = (args: { recipe: string | { id: string } } | [recipe: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RecipeController::update
* @see app/Http/Controllers/RecipeController.php:191
* @route '/recipes/{recipe}'
*/
updateForm.put = (args: { recipe: string | { id: string } } | [recipe: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RecipeController::update
* @see app/Http/Controllers/RecipeController.php:191
* @route '/recipes/{recipe}'
*/
updateForm.patch = (args: { recipe: string | { id: string } } | [recipe: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\RecipeController::destroy
* @see app/Http/Controllers/RecipeController.php:213
* @route '/recipes'
*/
export const destroy = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/recipes',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\RecipeController::destroy
* @see app/Http/Controllers/RecipeController.php:213
* @route '/recipes'
*/
destroy.url = (options?: RouteQueryOptions) => {
    return destroy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecipeController::destroy
* @see app/Http/Controllers/RecipeController.php:213
* @route '/recipes'
*/
destroy.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\RecipeController::destroy
* @see app/Http/Controllers/RecipeController.php:213
* @route '/recipes'
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
* @see \App\Http\Controllers\RecipeController::destroy
* @see app/Http/Controllers/RecipeController.php:213
* @route '/recipes'
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
* @see \App\Http\Controllers\RecipeController::generateRecipeWithAI
* @see app/Http/Controllers/RecipeController.php:109
* @route '/recipes/create'
*/
export const generateRecipeWithAI = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateRecipeWithAI.url(options),
    method: 'post',
})

generateRecipeWithAI.definition = {
    methods: ["post"],
    url: '/recipes/create',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RecipeController::generateRecipeWithAI
* @see app/Http/Controllers/RecipeController.php:109
* @route '/recipes/create'
*/
generateRecipeWithAI.url = (options?: RouteQueryOptions) => {
    return generateRecipeWithAI.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecipeController::generateRecipeWithAI
* @see app/Http/Controllers/RecipeController.php:109
* @route '/recipes/create'
*/
generateRecipeWithAI.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateRecipeWithAI.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RecipeController::generateRecipeWithAI
* @see app/Http/Controllers/RecipeController.php:109
* @route '/recipes/create'
*/
const generateRecipeWithAIForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: generateRecipeWithAI.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RecipeController::generateRecipeWithAI
* @see app/Http/Controllers/RecipeController.php:109
* @route '/recipes/create'
*/
generateRecipeWithAIForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: generateRecipeWithAI.url(options),
    method: 'post',
})

generateRecipeWithAI.form = generateRecipeWithAIForm

/**
* @see \App\Http\Controllers\RecipeController::image
* @see app/Http/Controllers/RecipeController.php:229
* @route '/recipes/{recipe}/image'
*/
export const image = (args: { recipe: string | { id: string } } | [recipe: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: image.url(args, options),
    method: 'get',
})

image.definition = {
    methods: ["get","head"],
    url: '/recipes/{recipe}/image',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RecipeController::image
* @see app/Http/Controllers/RecipeController.php:229
* @route '/recipes/{recipe}/image'
*/
image.url = (args: { recipe: string | { id: string } } | [recipe: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { recipe: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { recipe: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            recipe: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        recipe: typeof args.recipe === 'object'
        ? args.recipe.id
        : args.recipe,
    }

    return image.definition.url
            .replace('{recipe}', parsedArgs.recipe.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecipeController::image
* @see app/Http/Controllers/RecipeController.php:229
* @route '/recipes/{recipe}/image'
*/
image.get = (args: { recipe: string | { id: string } } | [recipe: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: image.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecipeController::image
* @see app/Http/Controllers/RecipeController.php:229
* @route '/recipes/{recipe}/image'
*/
image.head = (args: { recipe: string | { id: string } } | [recipe: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: image.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RecipeController::image
* @see app/Http/Controllers/RecipeController.php:229
* @route '/recipes/{recipe}/image'
*/
const imageForm = (args: { recipe: string | { id: string } } | [recipe: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: image.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecipeController::image
* @see app/Http/Controllers/RecipeController.php:229
* @route '/recipes/{recipe}/image'
*/
imageForm.get = (args: { recipe: string | { id: string } } | [recipe: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: image.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RecipeController::image
* @see app/Http/Controllers/RecipeController.php:229
* @route '/recipes/{recipe}/image'
*/
imageForm.head = (args: { recipe: string | { id: string } } | [recipe: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: image.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

image.form = imageForm

const RecipeController = { index, create, store, show, edit, update, destroy, generateRecipeWithAI, image }

export default RecipeController