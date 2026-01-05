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
    Route::resource('recipes', RecipeController::class)->except(['destroy']);
    Route::delete('recipes', [RecipeController::class, 'destroy'])->name('recipes.destroy');
    Route::post('recipes/create', [RecipeController::class, 'generateRecipeWithAI'])->name('recipes.generate');
    Route::post('recipes/{recipe}/upload-image', [RecipeController::class, 'uploadImage'])->name('recipes.upload-image');
    Route::get('recipes/{recipe}/image', [RecipeController::class, 'image'])->name('recipes.image');
    Route::resource('planned-meals', PlannedMealController::class)->except(['destroy']);
    Route::delete('planned-meals', [PlannedMealController::class, 'destroy'])->name('planned-meals.destroy');
    Route::get('shopping-lists', [ShoppingListController::class, 'index'])->name('shopping-lists.index');
    Route::put('shopping-lists/ingredients/{ingredient}', [ShoppingListController::class, 'toggleIngredient'])->name('shopping-lists.toggle-ingredient');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
