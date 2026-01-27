<?php

namespace Tests\Feature\MealPlanning;

use App\Models\User;
use App\Models\Workspace;
use App\Models\PlannedMeal;
use Database\Seeders\MealTimeSeeder;

require_once __DIR__ . '/../../Helpers/RecipeHelpers.php';

beforeEach(function () {
    // Seed roles and permissions first
    $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);
    
    $this->owner = User::factory()->create();
    $this->editor = User::factory()->create();
    $this->viewer = User::factory()->create();
    $this->outsider = User::factory()->create();
    
    // Create personal workspaces for all users
    Workspace::createPersonalWorkspace($this->owner);
    Workspace::createPersonalWorkspace($this->editor);
    Workspace::createPersonalWorkspace($this->viewer);
    Workspace::createPersonalWorkspace($this->outsider);
    
    $this->seed(MealTimeSeeder::class);
    
    // Create shared workspace
    $this->workspace = Workspace::create([
        'name' => 'Shared Workspace',
        'owner_id' => $this->owner->id,
        'is_personal' => false,
    ]);
    
    // Add members with different roles using workspace methods
    $this->workspace->users()->attach($this->editor->id, [
        'joined_at' => now(),
    ]);
    $this->workspace->giveEditorPermissions($this->editor);
    
    $this->workspace->users()->attach($this->viewer->id, [
        'joined_at' => now(),
    ]);
    $this->workspace->giveViewerPermissions($this->viewer);
    
    // Create recipes for each user
    $this->ownerRecipe = createRecipeResource($this->owner->id);
    $this->editorRecipe = createRecipeResource($this->editor->id);
    $this->viewerRecipe = createRecipeResource($this->viewer->id);
    $this->outsiderRecipe = createRecipeResource($this->outsider->id);
});

test('planned meals index includes workspace data', function () {
    // Set workspace in session
    $this->withSession(['current_workspace_id' => $this->workspace->id]);
    
    $response = $this->actingAs($this->owner)->get(route('planned-meals.index'));
    
    $response->assertStatus(200);
    $response->assertInertia(
        fn($page) => $page
            ->component('planned-meals/index')
            ->has('workspace_data')
            ->has('workspace_data.current_workspace')
            ->has('workspace_data.workspaces')
            ->has('workspace_data.pending_invitations')
            ->where('workspace_data.current_workspace.id', $this->workspace->id)
    );
});

test('planned meals index shows only workspace meals', function () {
    // Get automatically created personal workspace for owner
    $personalWorkspace = $this->owner->getPersonalWorkspace();
    $mealTime = \App\Models\MealTime::first();
    
    // Create meal in personal workspace
    $personalMeal = PlannedMeal::create([
        'user_id' => $this->owner->id,
        'recipe_id' => $this->ownerRecipe->resource->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => now()->addDay()->format('Y-m-d'),
        'workspace_id' => $personalWorkspace->id,
    ]);
    
    // Create meal in shared workspace
    $sharedMeal = PlannedMeal::create([
        'user_id' => $this->owner->id,
        'recipe_id' => $this->ownerRecipe->resource->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => now()->addDays(2)->format('Y-m-d'),
        'workspace_id' => $this->workspace->id,
    ]);
    
    // When viewing personal workspace, should only see personal meals
    $this->withSession(['current_workspace_id' => $personalWorkspace->id]);
    $response = $this->actingAs($this->owner)->get(route('planned-meals.index'));
    
    $response->assertInertia(function ($page) use ($personalMeal, $sharedMeal) {
        $plannedMeals = collect($page->toArray()['props']['plannedMeals']);
        $mealIds = $plannedMeals->pluck('id');
        
        expect($mealIds)->toContain($personalMeal->id);
        expect($mealIds)->not->toContain($sharedMeal->id);
    });
    
    // When viewing shared workspace, should only see shared meals
    $this->withSession(['current_workspace_id' => $this->workspace->id]);
    $response = $this->actingAs($this->owner)->get(route('planned-meals.index'));
    
    $response->assertInertia(function ($page) use ($personalMeal, $sharedMeal) {
        $plannedMeals = collect($page->toArray()['props']['plannedMeals']);
        $mealIds = $plannedMeals->pluck('id');
        
        expect($mealIds)->toContain($sharedMeal->id);
        expect($mealIds)->not->toContain($personalMeal->id);
    });
});

test('workspace members can plan meals in shared workspace', function () {
    $this->withSession(['current_workspace_id' => $this->workspace->id]);
    $mealTime = \App\Models\MealTime::first();
    
    $plannedMeal = [
        'recipe_id' => $this->editorRecipe->resource->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => now()->addDay()->format('Y-m-d'),
    ];

    $response = $this->actingAs($this->editor)
        ->post(route('planned-meals.store'), ['planned_meals' => [$plannedMeal]]);

    $response->assertStatus(302);
    $response->assertSessionHas('success', 'Meal successfully planned');

    $this->assertDatabaseHas('planned_meals', [
        'user_id' => $this->editor->id,
        'recipe_id' => $this->editorRecipe->resource->id,
        'workspace_id' => $this->workspace->id,
    ]);
});

test('viewers cannot plan meals in shared workspace', function () {
    $this->withSession(['current_workspace_id' => $this->workspace->id]);
    $mealTime = \App\Models\MealTime::first();
    
    $plannedMeal = [
        'recipe_id' => $this->viewerRecipe->resource->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => now()->addDay()->format('Y-m-d'),
    ];

    $response = $this->actingAs($this->viewer)
        ->post(route('planned-meals.store'), ['planned_meals' => [$plannedMeal]]);

    $response->assertStatus(302);
    $response->assertSessionHas('error', 'This action is unauthorized');

    $this->assertDatabaseMissing('planned_meals', [
        'user_id' => $this->viewer->id,
        'workspace_id' => $this->workspace->id,
    ]);
});

test('outsiders cannot plan meals in workspace', function () {
    $mealTime = \App\Models\MealTime::first();

    $plannedMeal = [
        'recipe_id' => $this->outsiderRecipe->resource->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => now()->addDay()->format('Y-m-d'),
    ];

    // Try to set session to shared workspace (outsider doesn't have access)
    // System should automatically switch to personal workspace
    $response = $this->actingAs($this->outsider)
        ->withSession(['current_workspace_id' => $this->workspace->id])
        ->post(route('planned-meals.store'), ['planned_meals' => [$plannedMeal]]);

    // Should succeed but create meal in outsider's personal workspace, not the shared workspace
    $response->assertStatus(302);

    // Verify meal was NOT created in the shared workspace
    $this->assertDatabaseMissing('planned_meals', [
        'user_id' => $this->outsider->id,
        'workspace_id' => $this->workspace->id,
    ]);

    // Verify meal was created in outsider's personal workspace instead
    $outsiderPersonalWorkspace = $this->outsider->getPersonalWorkspace();
    $this->assertDatabaseHas('planned_meals', [
        'user_id' => $this->outsider->id,
        'recipe_id' => $this->outsiderRecipe->resource->id,
        'workspace_id' => $outsiderPersonalWorkspace->id,
    ]);
});

test('workspace editors can delete any meal in shared workspace', function () {
    $this->withSession(['current_workspace_id' => $this->workspace->id]);
    $mealTime = \App\Models\MealTime::first();

    // Create meal by owner
    $ownerMeal = PlannedMeal::create([
        'user_id' => $this->owner->id,
        'recipe_id' => $this->ownerRecipe->resource->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => now()->addDay()->format('Y-m-d'),
        'workspace_id' => $this->workspace->id,
    ]);

    // Create meal by editor
    $editorMeal = PlannedMeal::create([
        'user_id' => $this->editor->id,
        'recipe_id' => $this->editorRecipe->resource->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => now()->addDays(2)->format('Y-m-d'),
        'workspace_id' => $this->workspace->id,
    ]);

    // Editor can delete own meal
    $response = $this->actingAs($this->editor)
        ->delete(route('planned-meals.destroy'), ['planned_meals' => [$editorMeal->id]]);

    $response->assertStatus(302);
    $this->assertDatabaseMissing('planned_meals', ['id' => $editorMeal->id]);

    // Editor CAN delete owner's meal (has planning.edit permission)
    $response = $this->actingAs($this->editor)
        ->delete(route('planned-meals.destroy'), ['planned_meals' => [$ownerMeal->id]]);

    $response->assertStatus(302);
    $this->assertDatabaseMissing('planned_meals', ['id' => $ownerMeal->id]);
});

test('automatically switches to personal workspace when none set', function () {
    // Don't set workspace in session
    $response = $this->actingAs($this->owner)->get(route('planned-meals.index'));
    
    $response->assertStatus(200);
    $response->assertInertia(
        fn($page) => $page
            ->where('workspace_data.current_workspace.is_personal', true)
            ->where('workspace_data.current_workspace.owner_id', $this->owner->id)
    );
    
    // Session should be updated
    $response->assertSessionHas('current_workspace_id');
});

test('switches to personal workspace when current workspace is inaccessible', function () {
    // Create workspace user has no access to
    $inaccessibleWorkspace = Workspace::create([
        'name' => 'Inaccessible Workspace',
        'owner_id' => $this->outsider->id,
        'is_personal' => false,
    ]);
    
    // Set inaccessible workspace in session
    $this->withSession(['current_workspace_id' => $inaccessibleWorkspace->id]);
    
    $response = $this->actingAs($this->owner)->get(route('planned-meals.index'));
    
    $response->assertStatus(200);
    $response->assertInertia(
        fn($page) => $page
            ->where('workspace_data.current_workspace.is_personal', true)
            ->where('workspace_data.current_workspace.owner_id', $this->owner->id)
    );
});

test('planned meals are created with current workspace id', function () {
    $this->withSession(['current_workspace_id' => $this->workspace->id]);
    $mealTime = \App\Models\MealTime::first();
    
    $plannedMeal = [
        'recipe_id' => $this->ownerRecipe->resource->id,
        'meal_time_id' => $mealTime->id,
        'planned_date' => now()->addDay()->format('Y-m-d'),
    ];

    $response = $this->actingAs($this->owner)
        ->post(route('planned-meals.store'), ['planned_meals' => [$plannedMeal]]);

    $response->assertStatus(302);
    
    $this->assertDatabaseHas('planned_meals', [
        'user_id' => $this->owner->id,
        'recipe_id' => $this->ownerRecipe->resource->id,
        'workspace_id' => $this->workspace->id,
    ]);
});

test('workspace members can view planned recipes from other members', function () {
    $mealTime = \App\Models\MealTime::first();
    
    // Owner plans a meal with their recipe in shared workspace
    $this->withSession(['current_workspace_id' => $this->workspace->id]);
    
    $this->actingAs($this->owner)
        ->post(route('planned-meals.store'), [
            'planned_meals' => [[
                'recipe_id' => $this->ownerRecipe->resource->id,
                'meal_time_id' => $mealTime->id,
                'planned_date' => now()->format('Y-m-d'),
            ]]
        ]);
    
    // Editor should be able to view the planned recipe details
    $response = $this->actingAs($this->editor)
        ->get(route('recipes.show', ['recipe' => $this->ownerRecipe->resource->id]));
    
    $response->assertStatus(200);
    $response->assertInertia(
        fn($page) => $page
            ->component('recipe/show')
            ->has('recipe')
            ->where('recipe.data.id', $this->ownerRecipe->resource->id)
    );
    
    // Viewer should also be able to view the planned recipe details
    $response = $this->actingAs($this->viewer)
        ->get(route('recipes.show', ['recipe' => $this->ownerRecipe->resource->id]));
    
    $response->assertStatus(200);
    $response->assertInertia(
        fn($page) => $page
            ->component('recipe/show')
            ->has('recipe')
            ->where('recipe.data.id', $this->ownerRecipe->resource->id)
    );
});

test('outsiders cannot view workspace planned recipes', function () {
    $mealTime = \App\Models\MealTime::first();
    
    // Owner plans a meal with their recipe in shared workspace
    $this->withSession(['current_workspace_id' => $this->workspace->id]);
    
    $this->actingAs($this->owner)
        ->post(route('planned-meals.store'), [
            'planned_meals' => [[
                'recipe_id' => $this->ownerRecipe->resource->id,
                'meal_time_id' => $mealTime->id,
                'planned_date' => now()->format('Y-m-d'),
            ]]
        ]);
    
    // Outsider should NOT be able to view the planned recipe
    $response = $this->actingAs($this->outsider)
        ->get(route('recipes.show', ['recipe' => $this->ownerRecipe->resource->id]));
    
    $response->assertStatus(403);
});