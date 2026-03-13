<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\BetaManagementController;
use App\Http\Controllers\Admin\MailPreviewController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'global.permissions', 'can:access-admin-panel'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        // Dashboard
        Route::get('/', [AdminController::class, 'dashboard'])
            ->name('dashboard');

        Route::prefix('beta-requests')->name('beta.')->group(function () {

            // Liste des demandes beta (avec filtres et stats)
            Route::get('/', [BetaManagementController::class, 'index'])
                ->name('index');

            // Approuver une demande → génère token + envoie email
            Route::post('/{betaRequest}/approve', [BetaManagementController::class, 'approve'])
                ->name('approve');

            // Rejeter une demande
            Route::post('/{betaRequest}/reject', [BetaManagementController::class, 'reject'])
                ->name('reject');

            // Renvoyer email invitation (si approved et non expiré)
            Route::post('/{betaRequest}/resend', [BetaManagementController::class, 'resend'])
                ->name('resend');

            // Cleanup TOUS les beta users (même non expirés) - DANGER
            Route::post('/cleanup-all', [BetaManagementController::class, 'cleanupAll'])
                ->name('cleanup-all');
        });

        // Email preview routes (admin only)
        Route::prefix('mail-preview')->name('mail.preview.')->group(function () {
            Route::get('beta-invitation/{locale}', [MailPreviewController::class, 'betaInvitation'])
                ->name('beta-invitation');

            Route::get('beta-confirmation/{locale}', [MailPreviewController::class, 'betaConfirmation'])
                ->name('beta-confirmation');

            Route::get('workspace-invitation/{locale}', [MailPreviewController::class, 'workspaceInvitation'])
                ->name('workspace-invitation');

            Route::get('reset-password/{locale}', [MailPreviewController::class, 'resetPassword'])
                ->name('reset-password');
        });

    });
