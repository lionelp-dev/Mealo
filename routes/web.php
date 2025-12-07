<?php

use App\Http\Controllers\PlannedMealController;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\ShoppingListController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::resource('recipes', RecipeController::class);
    Route::resource('planned-meals', PlannedMealController::class);
    Route::post('planned-meals/bulk', [PlannedMealController::class, 'bulkStore'])->name('planned-meals.bulk-store');
    Route::delete('planned-meals', [PlannedMealController::class, 'bulkDestroy'])->name('planned-meals.bulk-destroy');
    
    // Shopping List routes
    Route::get('shopping-lists', [ShoppingListController::class, 'index'])->name('shopping-lists.index');
    Route::put('shopping-lists/ingredients/{ingredient}', [ShoppingListController::class, 'toggleIngredient'])->name('shopping-lists.toggle-ingredient');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
