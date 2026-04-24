import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
  applyUrlDefaults,
} from './../../wayfinder';

/**
 * @see vendor/laravel/framework/src/Illuminate/Filesystem/FilesystemServiceProvider.php:98
 * @route '/storage/{path}'
 */
export const recipe_images = (
  args: { path: string | number } | [path: string | number] | string | number,
  options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
  url: recipe_images.url(args, options),
  method: 'get',
});

recipe_images.definition = {
  methods: ['get', 'head'],
  url: '/storage/{path}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see vendor/laravel/framework/src/Illuminate/Filesystem/FilesystemServiceProvider.php:98
 * @route '/storage/{path}'
 */
recipe_images.url = (
  args: { path: string | number } | [path: string | number] | string | number,
  options?: RouteQueryOptions,
) => {
  if (typeof args === 'string' || typeof args === 'number') {
    args = { path: args };
  }

  if (Array.isArray(args)) {
    args = {
      path: args[0],
    };
  }

  args = applyUrlDefaults(args);

  const parsedArgs = {
    path: args.path,
  };

  return (
    recipe_images.definition.url
      .replace('{path}', parsedArgs.path.toString())
      .replace(/\/+$/, '') + queryParams(options)
  );
};

/**
 * @see vendor/laravel/framework/src/Illuminate/Filesystem/FilesystemServiceProvider.php:98
 * @route '/storage/{path}'
 */
recipe_images.get = (
  args: { path: string | number } | [path: string | number] | string | number,
  options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
  url: recipe_images.url(args, options),
  method: 'get',
});

/**
 * @see vendor/laravel/framework/src/Illuminate/Filesystem/FilesystemServiceProvider.php:98
 * @route '/storage/{path}'
 */
recipe_images.head = (
  args: { path: string | number } | [path: string | number] | string | number,
  options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
  url: recipe_images.url(args, options),
  method: 'head',
});

/**
 * @see vendor/laravel/framework/src/Illuminate/Filesystem/FilesystemServiceProvider.php:98
 * @route '/storage/{path}'
 */
const recipe_imagesForm = (
  args: { path: string | number } | [path: string | number] | string | number,
  options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
  action: recipe_images.url(args, options),
  method: 'get',
});

/**
 * @see vendor/laravel/framework/src/Illuminate/Filesystem/FilesystemServiceProvider.php:98
 * @route '/storage/{path}'
 */
recipe_imagesForm.get = (
  args: { path: string | number } | [path: string | number] | string | number,
  options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
  action: recipe_images.url(args, options),
  method: 'get',
});

/**
 * @see vendor/laravel/framework/src/Illuminate/Filesystem/FilesystemServiceProvider.php:98
 * @route '/storage/{path}'
 */
recipe_imagesForm.head = (
  args: { path: string | number } | [path: string | number] | string | number,
  options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
  action: recipe_images.url(args, {
    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
      _method: 'HEAD',
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: 'get',
});

recipe_images.form = recipe_imagesForm;

const storage = {
  recipe_images: Object.assign(recipe_images, recipe_images),
};

export default storage;
