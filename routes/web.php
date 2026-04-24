<?php

use App\Http\Controllers\BetaRequestController;
use App\Http\Controllers\PlannedMealController;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\ShoppingListController;
use App\Http\Controllers\WorkspaceController;
use App\Http\Controllers\WorkspaceInvitationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('landing/index');
})->name('home');

Route::post('/beta/request', [BetaRequestController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('beta.request');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return to_route('planned-meals.index');
    })->name('dashboard');

    Route::get('recipes/show-ai-generation-modal', [RecipeController::class, 'showAIGenerationModal'])->name('recipes.show-ai-generation-modal');
    Route::post('recipes/ai-generation', [RecipeController::class, 'aiGeneration'])->name('recipes.ai-generation');
    Route::post('recipes/ai-image-generation', [RecipeController::class, 'aiImageGeneration'])->name('recipes.ai-image-generation');
    Route::get('recipes/{recipe}/image', [RecipeController::class, 'image'])->name('recipes.image');
    Route::delete('recipes', [RecipeController::class, 'destroy'])->name('recipes.destroy');
    Route::resource('recipes', RecipeController::class)->except(['destroy']);

    Route::resource('planned-meals', PlannedMealController::class)->except(['destroy']);
    Route::delete('planned-meals', [PlannedMealController::class, 'destroy'])->name('planned-meals.destroy');
    Route::post('planned-meals/generate', [PlannedMealController::class, 'generatePlan'])->name('planned-meals.generate');

    Route::get('shopping-lists', [ShoppingListController::class, 'index'])->name('shopping-lists.index');
    Route::put('shopping-lists', [ShoppingListController::class, 'update'])->name('shopping-lists.update');

    // Workspace routes
    Route::get('workspaces', [WorkspaceController::class, 'index'])->name('workspaces.index');
    Route::post('workspaces', [WorkspaceController::class, 'store'])->name('workspaces.store');
    Route::put('workspaces/{workspace}', [WorkspaceController::class, 'update'])->name('workspaces.update');
    Route::delete('workspaces/{workspace}', [WorkspaceController::class, 'destroy'])->name('workspaces.destroy');
    Route::post('workspaces/{workspace}/switch', [WorkspaceController::class, 'switch'])->name('workspaces.switch');
    Route::post('workspaces/{workspace}/leave', [WorkspaceController::class, 'leave'])->name('workspaces.leave');
    Route::delete('workspaces/{workspace}/members', [WorkspaceController::class, 'removeMember'])->name('workspaces.remove-member');
    Route::put('workspaces/{workspace}/members/role', [WorkspaceController::class, 'updateMemberRole'])->name('workspaces.update-member-role');

    // Workspace invitation routes
    Route::get('workspace-invitations', [WorkspaceInvitationController::class, 'index'])->name('workspace-invitations.index');
    Route::post('workspaces/{workspace_id}/invitations', [WorkspaceInvitationController::class, 'store'])->name('workspace-invitations.store');
    Route::delete('workspace-invitations/{invitation:id}', [WorkspaceInvitationController::class, 'destroy'])->name('workspace-invitations.destroy');

    // Authenticated invitation accept/decline routes
    Route::post('workspace-invitations/{token}/accept', [WorkspaceInvitationController::class, 'accept'])->name('workspace-invitations.accept');
    Route::post('workspace-invitations/{token}/decline', [WorkspaceInvitationController::class, 'decline'])->name('workspace-invitations.decline');
});

Route::get('workspace-invitations/{token}/accept', [WorkspaceInvitationController::class, 'acceptFromEmail'])
    ->name('workspace-invitations.acceptFromEmail');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
