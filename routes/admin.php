<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\DemoInviteController;
use App\Http\Controllers\Admin\MailPreviewController;
use App\Http\Controllers\Admin\UserManagementController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'global.permissions', 'can:access-admin-panel'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        // Dashboard
        Route::get('/', [AdminController::class, 'dashboard'])
            ->name('dashboard');

        // User management
        Route::get('users', [UserManagementController::class, 'index'])->name('users.index');
        Route::delete('users/{user}', [UserManagementController::class, 'destroy'])->name('users.destroy');
        Route::post('users/{user}/demo/extend', [UserManagementController::class, 'extendDemo'])->name('users.demo.extend');
        Route::post('users/{user}/demo/revoke', [UserManagementController::class, 'revokeDemo'])->name('users.demo.revoke');

        // Demo share links
        Route::resource('demo-invites', DemoInviteController::class)
            ->only(['index', 'store', 'update', 'destroy'])
            ->names('demo-invites');
        Route::post('demo-invites/{demo_invite}/toggle', [DemoInviteController::class, 'toggle'])->name('demo-invites.toggle');

        // Email preview routes (admin only)
        Route::prefix('mail-preview')->name('mail.preview.')->group(function () {
            Route::get('workspace-invitation/{locale}', [MailPreviewController::class, 'workspaceInvitation'])
                ->name('workspace-invitation');

            Route::get('reset-password/{locale}', [MailPreviewController::class, 'resetPassword'])
                ->name('reset-password');
        });

    });
