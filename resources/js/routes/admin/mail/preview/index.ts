import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\MailPreviewController::workspaceInvitation
* @see app/Http/Controllers/Admin/MailPreviewController.php:14
* @route '/admin/mail-preview/workspace-invitation/{locale}'
*/
export const workspaceInvitation = (args: { locale: string | number } | [locale: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: workspaceInvitation.url(args, options),
    method: 'get',
})

workspaceInvitation.definition = {
    methods: ["get","head"],
    url: '/admin/mail-preview/workspace-invitation/{locale}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\MailPreviewController::workspaceInvitation
* @see app/Http/Controllers/Admin/MailPreviewController.php:14
* @route '/admin/mail-preview/workspace-invitation/{locale}'
*/
workspaceInvitation.url = (args: { locale: string | number } | [locale: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { locale: args }
    }

    if (Array.isArray(args)) {
        args = {
            locale: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        locale: args.locale,
    }

    return workspaceInvitation.definition.url
            .replace('{locale}', parsedArgs.locale.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MailPreviewController::workspaceInvitation
* @see app/Http/Controllers/Admin/MailPreviewController.php:14
* @route '/admin/mail-preview/workspace-invitation/{locale}'
*/
workspaceInvitation.get = (args: { locale: string | number } | [locale: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: workspaceInvitation.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\MailPreviewController::workspaceInvitation
* @see app/Http/Controllers/Admin/MailPreviewController.php:14
* @route '/admin/mail-preview/workspace-invitation/{locale}'
*/
workspaceInvitation.head = (args: { locale: string | number } | [locale: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: workspaceInvitation.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\MailPreviewController::workspaceInvitation
* @see app/Http/Controllers/Admin/MailPreviewController.php:14
* @route '/admin/mail-preview/workspace-invitation/{locale}'
*/
const workspaceInvitationForm = (args: { locale: string | number } | [locale: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: workspaceInvitation.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\MailPreviewController::workspaceInvitation
* @see app/Http/Controllers/Admin/MailPreviewController.php:14
* @route '/admin/mail-preview/workspace-invitation/{locale}'
*/
workspaceInvitationForm.get = (args: { locale: string | number } | [locale: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: workspaceInvitation.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\MailPreviewController::workspaceInvitation
* @see app/Http/Controllers/Admin/MailPreviewController.php:14
* @route '/admin/mail-preview/workspace-invitation/{locale}'
*/
workspaceInvitationForm.head = (args: { locale: string | number } | [locale: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: workspaceInvitation.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

workspaceInvitation.form = workspaceInvitationForm

/**
* @see \App\Http\Controllers\Admin\MailPreviewController::resetPassword
* @see app/Http/Controllers/Admin/MailPreviewController.php:29
* @route '/admin/mail-preview/reset-password/{locale}'
*/
export const resetPassword = (args: { locale: string | number } | [locale: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resetPassword.url(args, options),
    method: 'get',
})

resetPassword.definition = {
    methods: ["get","head"],
    url: '/admin/mail-preview/reset-password/{locale}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\MailPreviewController::resetPassword
* @see app/Http/Controllers/Admin/MailPreviewController.php:29
* @route '/admin/mail-preview/reset-password/{locale}'
*/
resetPassword.url = (args: { locale: string | number } | [locale: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { locale: args }
    }

    if (Array.isArray(args)) {
        args = {
            locale: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        locale: args.locale,
    }

    return resetPassword.definition.url
            .replace('{locale}', parsedArgs.locale.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MailPreviewController::resetPassword
* @see app/Http/Controllers/Admin/MailPreviewController.php:29
* @route '/admin/mail-preview/reset-password/{locale}'
*/
resetPassword.get = (args: { locale: string | number } | [locale: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resetPassword.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\MailPreviewController::resetPassword
* @see app/Http/Controllers/Admin/MailPreviewController.php:29
* @route '/admin/mail-preview/reset-password/{locale}'
*/
resetPassword.head = (args: { locale: string | number } | [locale: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: resetPassword.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\MailPreviewController::resetPassword
* @see app/Http/Controllers/Admin/MailPreviewController.php:29
* @route '/admin/mail-preview/reset-password/{locale}'
*/
const resetPasswordForm = (args: { locale: string | number } | [locale: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: resetPassword.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\MailPreviewController::resetPassword
* @see app/Http/Controllers/Admin/MailPreviewController.php:29
* @route '/admin/mail-preview/reset-password/{locale}'
*/
resetPasswordForm.get = (args: { locale: string | number } | [locale: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: resetPassword.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\MailPreviewController::resetPassword
* @see app/Http/Controllers/Admin/MailPreviewController.php:29
* @route '/admin/mail-preview/reset-password/{locale}'
*/
resetPasswordForm.head = (args: { locale: string | number } | [locale: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: resetPassword.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

resetPassword.form = resetPasswordForm

const preview = {
    workspaceInvitation: Object.assign(workspaceInvitation, workspaceInvitation),
    resetPassword: Object.assign(resetPassword, resetPassword),
}

export default preview