import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
  applyUrlDefaults,
} from './../../../../../wayfinder';

/**
 * @see \App\Http\Controllers\Auth\BetaInvitationController::show
 * @see app/Http/Controllers/Auth/BetaInvitationController.php:20
 * @route '/beta/accept/{token}'
 */
export const show = (
  args: { token: string | number } | [token: string | number] | string | number,
  options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
  url: show.url(args, options),
  method: 'get',
});

show.definition = {
  methods: ['get', 'head'],
  url: '/beta/accept/{token}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\Auth\BetaInvitationController::show
 * @see app/Http/Controllers/Auth/BetaInvitationController.php:20
 * @route '/beta/accept/{token}'
 */
show.url = (
  args: { token: string | number } | [token: string | number] | string | number,
  options?: RouteQueryOptions,
) => {
  if (typeof args === 'string' || typeof args === 'number') {
    args = { token: args };
  }

  if (Array.isArray(args)) {
    args = {
      token: args[0],
    };
  }

  args = applyUrlDefaults(args);

  const parsedArgs = {
    token: args.token,
  };

  return (
    show.definition.url
      .replace('{token}', parsedArgs.token.toString())
      .replace(/\/+$/, '') + queryParams(options)
  );
};

/**
 * @see \App\Http\Controllers\Auth\BetaInvitationController::show
 * @see app/Http/Controllers/Auth/BetaInvitationController.php:20
 * @route '/beta/accept/{token}'
 */
show.get = (
  args: { token: string | number } | [token: string | number] | string | number,
  options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
  url: show.url(args, options),
  method: 'get',
});

/**
 * @see \App\Http\Controllers\Auth\BetaInvitationController::show
 * @see app/Http/Controllers/Auth/BetaInvitationController.php:20
 * @route '/beta/accept/{token}'
 */
show.head = (
  args: { token: string | number } | [token: string | number] | string | number,
  options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
  url: show.url(args, options),
  method: 'head',
});

/**
 * @see \App\Http\Controllers\Auth\BetaInvitationController::show
 * @see app/Http/Controllers/Auth/BetaInvitationController.php:20
 * @route '/beta/accept/{token}'
 */
const showForm = (
  args: { token: string | number } | [token: string | number] | string | number,
  options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
  action: show.url(args, options),
  method: 'get',
});

/**
 * @see \App\Http\Controllers\Auth\BetaInvitationController::show
 * @see app/Http/Controllers/Auth/BetaInvitationController.php:20
 * @route '/beta/accept/{token}'
 */
showForm.get = (
  args: { token: string | number } | [token: string | number] | string | number,
  options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
  action: show.url(args, options),
  method: 'get',
});

/**
 * @see \App\Http\Controllers\Auth\BetaInvitationController::show
 * @see app/Http/Controllers/Auth/BetaInvitationController.php:20
 * @route '/beta/accept/{token}'
 */
showForm.head = (
  args: { token: string | number } | [token: string | number] | string | number,
  options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
  action: show.url(args, {
    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
      _method: 'HEAD',
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: 'get',
});

show.form = showForm;

/**
 * @see \App\Http\Controllers\Auth\BetaInvitationController::accept
 * @see app/Http/Controllers/Auth/BetaInvitationController.php:42
 * @route '/beta/accept/{token}'
 */
export const accept = (
  args: { token: string | number } | [token: string | number] | string | number,
  options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
  url: accept.url(args, options),
  method: 'post',
});

accept.definition = {
  methods: ['post'],
  url: '/beta/accept/{token}',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\Auth\BetaInvitationController::accept
 * @see app/Http/Controllers/Auth/BetaInvitationController.php:42
 * @route '/beta/accept/{token}'
 */
accept.url = (
  args: { token: string | number } | [token: string | number] | string | number,
  options?: RouteQueryOptions,
) => {
  if (typeof args === 'string' || typeof args === 'number') {
    args = { token: args };
  }

  if (Array.isArray(args)) {
    args = {
      token: args[0],
    };
  }

  args = applyUrlDefaults(args);

  const parsedArgs = {
    token: args.token,
  };

  return (
    accept.definition.url
      .replace('{token}', parsedArgs.token.toString())
      .replace(/\/+$/, '') + queryParams(options)
  );
};

/**
 * @see \App\Http\Controllers\Auth\BetaInvitationController::accept
 * @see app/Http/Controllers/Auth/BetaInvitationController.php:42
 * @route '/beta/accept/{token}'
 */
accept.post = (
  args: { token: string | number } | [token: string | number] | string | number,
  options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
  url: accept.url(args, options),
  method: 'post',
});

/**
 * @see \App\Http\Controllers\Auth\BetaInvitationController::accept
 * @see app/Http/Controllers/Auth/BetaInvitationController.php:42
 * @route '/beta/accept/{token}'
 */
const acceptForm = (
  args: { token: string | number } | [token: string | number] | string | number,
  options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
  action: accept.url(args, options),
  method: 'post',
});

/**
 * @see \App\Http\Controllers\Auth\BetaInvitationController::accept
 * @see app/Http/Controllers/Auth/BetaInvitationController.php:42
 * @route '/beta/accept/{token}'
 */
acceptForm.post = (
  args: { token: string | number } | [token: string | number] | string | number,
  options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
  action: accept.url(args, options),
  method: 'post',
});

accept.form = acceptForm;

const BetaInvitationController = { show, accept };

export default BetaInvitationController;
