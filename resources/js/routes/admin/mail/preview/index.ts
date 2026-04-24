import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
  applyUrlDefaults,
} from './../../../../wayfinder';

/**
 * @see \App\Http\Controllers\Admin\MailPreviewController::betaInvitation
 * @see app/Http/Controllers/Admin/MailPreviewController.php:17
 * @route '/admin/mail-preview/beta-invitation/{locale}'
 */
export const betaInvitation = (
  args:
    | { locale: string | number }
    | [locale: string | number]
    | string
    | number,
  options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
  url: betaInvitation.url(args, options),
  method: 'get',
});

betaInvitation.definition = {
  methods: ['get', 'head'],
  url: '/admin/mail-preview/beta-invitation/{locale}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\Admin\MailPreviewController::betaInvitation
 * @see app/Http/Controllers/Admin/MailPreviewController.php:17
 * @route '/admin/mail-preview/beta-invitation/{locale}'
 */
betaInvitation.url = (
  args:
    | { locale: string | number }
    | [locale: string | number]
    | string
    | number,
  options?: RouteQueryOptions,
) => {
  if (typeof args === 'string' || typeof args === 'number') {
    args = { locale: args };
  }

  if (Array.isArray(args)) {
    args = {
      locale: args[0],
    };
  }

  args = applyUrlDefaults(args);

  const parsedArgs = {
    locale: args.locale,
  };

  return (
    betaInvitation.definition.url
      .replace('{locale}', parsedArgs.locale.toString())
      .replace(/\/+$/, '') + queryParams(options)
  );
};

/**
 * @see \App\Http\Controllers\Admin\MailPreviewController::betaInvitation
 * @see app/Http/Controllers/Admin/MailPreviewController.php:17
 * @route '/admin/mail-preview/beta-invitation/{locale}'
 */
betaInvitation.get = (
  args:
    | { locale: string | number }
    | [locale: string | number]
    | string
    | number,
  options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
  url: betaInvitation.url(args, options),
  method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\MailPreviewController::betaInvitation
 * @see app/Http/Controllers/Admin/MailPreviewController.php:17
 * @route '/admin/mail-preview/beta-invitation/{locale}'
 */
betaInvitation.head = (
  args:
    | { locale: string | number }
    | [locale: string | number]
    | string
    | number,
  options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
  url: betaInvitation.url(args, options),
  method: 'head',
});

/**
 * @see \App\Http\Controllers\Admin\MailPreviewController::betaInvitation
 * @see app/Http/Controllers/Admin/MailPreviewController.php:17
 * @route '/admin/mail-preview/beta-invitation/{locale}'
 */
const betaInvitationForm = (
  args:
    | { locale: string | number }
    | [locale: string | number]
    | string
    | number,
  options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
  action: betaInvitation.url(args, options),
  method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\MailPreviewController::betaInvitation
 * @see app/Http/Controllers/Admin/MailPreviewController.php:17
 * @route '/admin/mail-preview/beta-invitation/{locale}'
 */
betaInvitationForm.get = (
  args:
    | { locale: string | number }
    | [locale: string | number]
    | string
    | number,
  options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
  action: betaInvitation.url(args, options),
  method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\MailPreviewController::betaInvitation
 * @see app/Http/Controllers/Admin/MailPreviewController.php:17
 * @route '/admin/mail-preview/beta-invitation/{locale}'
 */
betaInvitationForm.head = (
  args:
    | { locale: string | number }
    | [locale: string | number]
    | string
    | number,
  options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
  action: betaInvitation.url(args, {
    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
      _method: 'HEAD',
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: 'get',
});

betaInvitation.form = betaInvitationForm;

/**
 * @see \App\Http\Controllers\Admin\MailPreviewController::betaConfirmation
 * @see app/Http/Controllers/Admin/MailPreviewController.php:32
 * @route '/admin/mail-preview/beta-confirmation/{locale}'
 */
export const betaConfirmation = (
  args:
    | { locale: string | number }
    | [locale: string | number]
    | string
    | number,
  options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
  url: betaConfirmation.url(args, options),
  method: 'get',
});

betaConfirmation.definition = {
  methods: ['get', 'head'],
  url: '/admin/mail-preview/beta-confirmation/{locale}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\Admin\MailPreviewController::betaConfirmation
 * @see app/Http/Controllers/Admin/MailPreviewController.php:32
 * @route '/admin/mail-preview/beta-confirmation/{locale}'
 */
betaConfirmation.url = (
  args:
    | { locale: string | number }
    | [locale: string | number]
    | string
    | number,
  options?: RouteQueryOptions,
) => {
  if (typeof args === 'string' || typeof args === 'number') {
    args = { locale: args };
  }

  if (Array.isArray(args)) {
    args = {
      locale: args[0],
    };
  }

  args = applyUrlDefaults(args);

  const parsedArgs = {
    locale: args.locale,
  };

  return (
    betaConfirmation.definition.url
      .replace('{locale}', parsedArgs.locale.toString())
      .replace(/\/+$/, '') + queryParams(options)
  );
};

/**
 * @see \App\Http\Controllers\Admin\MailPreviewController::betaConfirmation
 * @see app/Http/Controllers/Admin/MailPreviewController.php:32
 * @route '/admin/mail-preview/beta-confirmation/{locale}'
 */
betaConfirmation.get = (
  args:
    | { locale: string | number }
    | [locale: string | number]
    | string
    | number,
  options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
  url: betaConfirmation.url(args, options),
  method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\MailPreviewController::betaConfirmation
 * @see app/Http/Controllers/Admin/MailPreviewController.php:32
 * @route '/admin/mail-preview/beta-confirmation/{locale}'
 */
betaConfirmation.head = (
  args:
    | { locale: string | number }
    | [locale: string | number]
    | string
    | number,
  options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
  url: betaConfirmation.url(args, options),
  method: 'head',
});

/**
 * @see \App\Http\Controllers\Admin\MailPreviewController::betaConfirmation
 * @see app/Http/Controllers/Admin/MailPreviewController.php:32
 * @route '/admin/mail-preview/beta-confirmation/{locale}'
 */
const betaConfirmationForm = (
  args:
    | { locale: string | number }
    | [locale: string | number]
    | string
    | number,
  options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
  action: betaConfirmation.url(args, options),
  method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\MailPreviewController::betaConfirmation
 * @see app/Http/Controllers/Admin/MailPreviewController.php:32
 * @route '/admin/mail-preview/beta-confirmation/{locale}'
 */
betaConfirmationForm.get = (
  args:
    | { locale: string | number }
    | [locale: string | number]
    | string
    | number,
  options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
  action: betaConfirmation.url(args, options),
  method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\MailPreviewController::betaConfirmation
 * @see app/Http/Controllers/Admin/MailPreviewController.php:32
 * @route '/admin/mail-preview/beta-confirmation/{locale}'
 */
betaConfirmationForm.head = (
  args:
    | { locale: string | number }
    | [locale: string | number]
    | string
    | number,
  options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
  action: betaConfirmation.url(args, {
    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
      _method: 'HEAD',
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: 'get',
});

betaConfirmation.form = betaConfirmationForm;

/**
 * @see \App\Http\Controllers\Admin\MailPreviewController::workspaceInvitation
 * @see app/Http/Controllers/Admin/MailPreviewController.php:44
 * @route '/admin/mail-preview/workspace-invitation/{locale}'
 */
export const workspaceInvitation = (
  args:
    | { locale: string | number }
    | [locale: string | number]
    | string
    | number,
  options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
  url: workspaceInvitation.url(args, options),
  method: 'get',
});

workspaceInvitation.definition = {
  methods: ['get', 'head'],
  url: '/admin/mail-preview/workspace-invitation/{locale}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\Admin\MailPreviewController::workspaceInvitation
 * @see app/Http/Controllers/Admin/MailPreviewController.php:44
 * @route '/admin/mail-preview/workspace-invitation/{locale}'
 */
workspaceInvitation.url = (
  args:
    | { locale: string | number }
    | [locale: string | number]
    | string
    | number,
  options?: RouteQueryOptions,
) => {
  if (typeof args === 'string' || typeof args === 'number') {
    args = { locale: args };
  }

  if (Array.isArray(args)) {
    args = {
      locale: args[0],
    };
  }

  args = applyUrlDefaults(args);

  const parsedArgs = {
    locale: args.locale,
  };

  return (
    workspaceInvitation.definition.url
      .replace('{locale}', parsedArgs.locale.toString())
      .replace(/\/+$/, '') + queryParams(options)
  );
};

/**
 * @see \App\Http\Controllers\Admin\MailPreviewController::workspaceInvitation
 * @see app/Http/Controllers/Admin/MailPreviewController.php:44
 * @route '/admin/mail-preview/workspace-invitation/{locale}'
 */
workspaceInvitation.get = (
  args:
    | { locale: string | number }
    | [locale: string | number]
    | string
    | number,
  options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
  url: workspaceInvitation.url(args, options),
  method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\MailPreviewController::workspaceInvitation
 * @see app/Http/Controllers/Admin/MailPreviewController.php:44
 * @route '/admin/mail-preview/workspace-invitation/{locale}'
 */
workspaceInvitation.head = (
  args:
    | { locale: string | number }
    | [locale: string | number]
    | string
    | number,
  options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
  url: workspaceInvitation.url(args, options),
  method: 'head',
});

/**
 * @see \App\Http\Controllers\Admin\MailPreviewController::workspaceInvitation
 * @see app/Http/Controllers/Admin/MailPreviewController.php:44
 * @route '/admin/mail-preview/workspace-invitation/{locale}'
 */
const workspaceInvitationForm = (
  args:
    | { locale: string | number }
    | [locale: string | number]
    | string
    | number,
  options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
  action: workspaceInvitation.url(args, options),
  method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\MailPreviewController::workspaceInvitation
 * @see app/Http/Controllers/Admin/MailPreviewController.php:44
 * @route '/admin/mail-preview/workspace-invitation/{locale}'
 */
workspaceInvitationForm.get = (
  args:
    | { locale: string | number }
    | [locale: string | number]
    | string
    | number,
  options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
  action: workspaceInvitation.url(args, options),
  method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\MailPreviewController::workspaceInvitation
 * @see app/Http/Controllers/Admin/MailPreviewController.php:44
 * @route '/admin/mail-preview/workspace-invitation/{locale}'
 */
workspaceInvitationForm.head = (
  args:
    | { locale: string | number }
    | [locale: string | number]
    | string
    | number,
  options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
  action: workspaceInvitation.url(args, {
    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
      _method: 'HEAD',
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: 'get',
});

workspaceInvitation.form = workspaceInvitationForm;

/**
 * @see \App\Http\Controllers\Admin\MailPreviewController::resetPassword
 * @see app/Http/Controllers/Admin/MailPreviewController.php:59
 * @route '/admin/mail-preview/reset-password/{locale}'
 */
export const resetPassword = (
  args:
    | { locale: string | number }
    | [locale: string | number]
    | string
    | number,
  options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
  url: resetPassword.url(args, options),
  method: 'get',
});

resetPassword.definition = {
  methods: ['get', 'head'],
  url: '/admin/mail-preview/reset-password/{locale}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\Admin\MailPreviewController::resetPassword
 * @see app/Http/Controllers/Admin/MailPreviewController.php:59
 * @route '/admin/mail-preview/reset-password/{locale}'
 */
resetPassword.url = (
  args:
    | { locale: string | number }
    | [locale: string | number]
    | string
    | number,
  options?: RouteQueryOptions,
) => {
  if (typeof args === 'string' || typeof args === 'number') {
    args = { locale: args };
  }

  if (Array.isArray(args)) {
    args = {
      locale: args[0],
    };
  }

  args = applyUrlDefaults(args);

  const parsedArgs = {
    locale: args.locale,
  };

  return (
    resetPassword.definition.url
      .replace('{locale}', parsedArgs.locale.toString())
      .replace(/\/+$/, '') + queryParams(options)
  );
};

/**
 * @see \App\Http\Controllers\Admin\MailPreviewController::resetPassword
 * @see app/Http/Controllers/Admin/MailPreviewController.php:59
 * @route '/admin/mail-preview/reset-password/{locale}'
 */
resetPassword.get = (
  args:
    | { locale: string | number }
    | [locale: string | number]
    | string
    | number,
  options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
  url: resetPassword.url(args, options),
  method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\MailPreviewController::resetPassword
 * @see app/Http/Controllers/Admin/MailPreviewController.php:59
 * @route '/admin/mail-preview/reset-password/{locale}'
 */
resetPassword.head = (
  args:
    | { locale: string | number }
    | [locale: string | number]
    | string
    | number,
  options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
  url: resetPassword.url(args, options),
  method: 'head',
});

/**
 * @see \App\Http\Controllers\Admin\MailPreviewController::resetPassword
 * @see app/Http/Controllers/Admin/MailPreviewController.php:59
 * @route '/admin/mail-preview/reset-password/{locale}'
 */
const resetPasswordForm = (
  args:
    | { locale: string | number }
    | [locale: string | number]
    | string
    | number,
  options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
  action: resetPassword.url(args, options),
  method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\MailPreviewController::resetPassword
 * @see app/Http/Controllers/Admin/MailPreviewController.php:59
 * @route '/admin/mail-preview/reset-password/{locale}'
 */
resetPasswordForm.get = (
  args:
    | { locale: string | number }
    | [locale: string | number]
    | string
    | number,
  options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
  action: resetPassword.url(args, options),
  method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\MailPreviewController::resetPassword
 * @see app/Http/Controllers/Admin/MailPreviewController.php:59
 * @route '/admin/mail-preview/reset-password/{locale}'
 */
resetPasswordForm.head = (
  args:
    | { locale: string | number }
    | [locale: string | number]
    | string
    | number,
  options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
  action: resetPassword.url(args, {
    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
      _method: 'HEAD',
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: 'get',
});

resetPassword.form = resetPasswordForm;

const preview = {
  betaInvitation: Object.assign(betaInvitation, betaInvitation),
  betaConfirmation: Object.assign(betaConfirmation, betaConfirmation),
  workspaceInvitation: Object.assign(workspaceInvitation, workspaceInvitation),
  resetPassword: Object.assign(resetPassword, resetPassword),
};

export default preview;
