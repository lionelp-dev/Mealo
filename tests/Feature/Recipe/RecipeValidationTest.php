<?php

use App\Models\User;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->user = User::factory()->create();
});

// ---------------------------------------------------------------------------
// Description Validation
// ---------------------------------------------------------------------------

test('recipe can have a 5000 character description', function () {
    actingAs($this->user)
        ->post(route('recipes.store'), [
            'name' => 'Long Description Recipe',
            'description' => str_repeat('a', 5000),
            'serving_size' => 4,
            'preparation_time' => 30,
            'cooking_time' => 60,
            'meal_times' => [],
            'ingredients' => [],
            'steps' => [],
            'tags' => [],
        ])
        ->assertRedirect(route('recipes.index'));

    $this->assertDatabaseHas('recipes', [
        'name' => 'Long Description Recipe',
    ]);
});

test('recipe cannot have description longer than 5000 characters', function () {
    actingAs($this->user)
        ->post(route('recipes.store'), [
            'name' => 'Too Long Description',
            'description' => str_repeat('a', 5001),
            'serving_size' => 4,
            'preparation_time' => 30,
            'cooking_time' => 60,
            'meal_times' => [],
            'ingredients' => [],
            'steps' => [],
            'tags' => [],
        ])
        ->assertRedirect()
        ->assertSessionHasErrors(['description']);
});

// ---------------------------------------------------------------------------
// Time Validation (0 minutes and 14 days)
// ---------------------------------------------------------------------------

test('recipe can have 0 preparation time and 0 cooking time', function () {
    actingAs($this->user)
        ->post(route('recipes.store'), [
            'name' => 'No Prep No Cook',
            'description' => 'Pre-made dish',
            'serving_size' => 2,
            'preparation_time' => 0,
            'cooking_time' => 0,
            'meal_times' => [],
            'ingredients' => [],
            'steps' => [],
            'tags' => [],
        ])
        ->assertRedirect(route('recipes.index'));

    $this->assertDatabaseHas('recipes', [
        'name' => 'No Prep No Cook',
        'preparation_time' => 0,
        'cooking_time' => 0,
    ]);
});

test('recipe can have 14 days (20160 minutes) preparation time', function () {
    actingAs($this->user)
        ->post(route('recipes.store'), [
            'name' => 'Long Marinade',
            'description' => 'Requires 14 days marinade',
            'serving_size' => 4,
            'preparation_time' => 20160,
            'cooking_time' => 60,
            'meal_times' => [],
            'ingredients' => [],
            'steps' => [],
            'tags' => [],
        ])
        ->assertRedirect(route('recipes.index'));

    $this->assertDatabaseHas('recipes', [
        'name' => 'Long Marinade',
        'preparation_time' => 20160,
    ]);
});

test('recipe can have 14 days (20160 minutes) cooking time', function () {
    actingAs($this->user)
        ->post(route('recipes.store'), [
            'name' => 'Dry-Aged Meat',
            'description' => 'Requires 14 days curing',
            'serving_size' => 4,
            'preparation_time' => 30,
            'cooking_time' => 20160,
            'meal_times' => [],
            'ingredients' => [],
            'steps' => [],
            'tags' => [],
        ])
        ->assertRedirect(route('recipes.index'));

    $this->assertDatabaseHas('recipes', [
        'name' => 'Dry-Aged Meat',
        'cooking_time' => 20160,
    ]);
});

test('recipe cannot have preparation time longer than 20160 minutes', function () {
    actingAs($this->user)
        ->post(route('recipes.store'), [
            'name' => 'Too Long Prep',
            'description' => 'Invalid prep time',
            'serving_size' => 4,
            'preparation_time' => 20161,
            'cooking_time' => 60,
            'meal_times' => [],
            'ingredients' => [],
            'steps' => [],
            'tags' => [],
        ])
        ->assertRedirect()
        ->assertSessionHasErrors(['preparation_time']);
});

test('recipe cannot have cooking time longer than 20160 minutes', function () {
    actingAs($this->user)
        ->post(route('recipes.store'), [
            'name' => 'Too Long Cook',
            'description' => 'Invalid cooking time',
            'serving_size' => 4,
            'preparation_time' => 30,
            'cooking_time' => 20161,
            'meal_times' => [],
            'ingredients' => [],
            'steps' => [],
            'tags' => [],
        ])
        ->assertRedirect()
        ->assertSessionHasErrors(['cooking_time']);
});

test('recipe cannot have negative preparation time', function () {
    actingAs($this->user)
        ->post(route('recipes.store'), [
            'name' => 'Negative Prep',
            'description' => 'Invalid',
            'serving_size' => 4,
            'preparation_time' => -1,
            'cooking_time' => 60,
            'meal_times' => [],
            'ingredients' => [],
            'steps' => [],
            'tags' => [],
        ])
        ->assertRedirect()
        ->assertSessionHasErrors(['preparation_time']);
});

// ---------------------------------------------------------------------------
// Ingredient Name Validation
// ---------------------------------------------------------------------------

test('ingredient can have short name like Salt', function () {
    actingAs($this->user)
        ->post(route('recipes.store'), [
            'name' => 'Short Ingredient Names',
            'description' => 'Recipe with short ingredient names',
            'serving_size' => 4,
            'preparation_time' => 30,
            'cooking_time' => 60,
            'meal_times' => [],
            'ingredients' => [
                ['name' => 'Salt', 'quantity' => 5, 'unit' => 'g'],
                ['name' => 'Ail', 'quantity' => 2, 'unit' => 'pc'],
                ['name' => 'Riz', 'quantity' => 200, 'unit' => 'g'],
            ],
            'steps' => [],
            'tags' => [],
        ])
        ->assertRedirect(route('recipes.index'));

    $this->assertDatabaseHas('ingredients', [
        'name' => 'Salt',
    ]);
});

test('ingredient cannot have empty name', function () {
    $recipe = recipeResourceFor($this->user);

    actingAs($this->user)
        ->put(route('recipes.update', $recipe), [
            'name' => $recipe->name,
            'description' => $recipe->description,
            'serving_size' => $recipe->serving_size,
            'preparation_time' => $recipe->preparation_time,
            'cooking_time' => $recipe->cooking_time,
            'meal_times' => [],
            'ingredients' => [
                ['name' => '', 'quantity' => 5, 'unit' => 'g'],
            ],
            'steps' => [],
            'tags' => [],
        ])
        ->assertRedirect()
        ->assertSessionHasErrors(['ingredients.0.name']);
});

test('ingredient can have quantity up to 10000', function () {
    actingAs($this->user)
        ->post(route('recipes.store'), [
            'name' => 'Large Quantity Recipe',
            'description' => 'Recipe with large ingredient quantity',
            'serving_size' => 50,
            'preparation_time' => 120,
            'cooking_time' => 180,
            'meal_times' => [],
            'ingredients' => [
                ['name' => 'Flour', 'quantity' => 10000, 'unit' => 'g'],
            ],
            'steps' => [],
            'tags' => [],
        ])
        ->assertRedirect(route('recipes.index'))
        ->assertSessionHasNoErrors();
});

// ---------------------------------------------------------------------------
// Step Order Validation
// ---------------------------------------------------------------------------

test('step can have order starting at 1', function () {
    $recipe = recipeResourceFor($this->user);

    actingAs($this->user)
        ->put(route('recipes.update', $recipe), [
            'name' => $recipe->name,
            'description' => $recipe->description,
            'serving_size' => $recipe->serving_size,
            'preparation_time' => $recipe->preparation_time,
            'cooking_time' => $recipe->cooking_time,
            'meal_times' => [],
            'ingredients' => [],
            'steps' => [
                ['order' => 1, 'description' => 'First step'],
                ['order' => 2, 'description' => 'Second step'],
                ['order' => 3, 'description' => 'Third step'],
            ],
            'tags' => [],
        ])
        ->assertRedirect(route('recipes.show', $recipe));

    $this->assertDatabaseHas('steps', [
        'recipe_id' => $recipe->id,
        'order' => 1,
        'description' => 'First step',
    ]);
});

test('step cannot have order 0', function () {
    $recipe = recipeResourceFor($this->user);

    actingAs($this->user)
        ->put(route('recipes.update', $recipe), [
            'name' => $recipe->name,
            'description' => $recipe->description,
            'serving_size' => $recipe->serving_size,
            'preparation_time' => $recipe->preparation_time,
            'cooking_time' => $recipe->cooking_time,
            'meal_times' => [],
            'ingredients' => [],
            'steps' => [
                ['order' => 0, 'description' => 'Invalid step'],
            ],
            'tags' => [],
        ])
        ->assertRedirect()
        ->assertSessionHasErrors(['steps.0.order']);
});

test('step can have detailed description up to 1000 characters', function () {
    $recipe = recipeResourceFor($this->user);
    $longDescription = str_repeat('a', 1000);

    actingAs($this->user)
        ->put(route('recipes.update', $recipe), [
            'name' => $recipe->name,
            'description' => $recipe->description,
            'serving_size' => $recipe->serving_size,
            'preparation_time' => $recipe->preparation_time,
            'cooking_time' => $recipe->cooking_time,
            'meal_times' => [],
            'ingredients' => [],
            'steps' => [
                ['order' => 1, 'description' => $longDescription],
            ],
            'tags' => [],
        ])
        ->assertRedirect(route('recipes.show', $recipe));

    $this->assertDatabaseHas('steps', [
        'recipe_id' => $recipe->id,
        'order' => 1,
        'description' => $longDescription,
    ]);
});

// ---------------------------------------------------------------------------
// Tag Name Validation
// ---------------------------------------------------------------------------

test('tag can have short name like Bio', function () {
    $recipe = recipeResourceFor($this->user);

    actingAs($this->user)
        ->put(route('recipes.update', $recipe), [
            'name' => $recipe->name,
            'description' => $recipe->description,
            'serving_size' => $recipe->serving_size,
            'preparation_time' => $recipe->preparation_time,
            'cooking_time' => $recipe->cooking_time,
            'meal_times' => [],
            'ingredients' => [],
            'steps' => [],
            'tags' => [
                ['name' => 'Bio'],
                ['name' => 'BBQ'],
                ['name' => 'Quick'],
            ],
        ])
        ->assertRedirect(route('recipes.show', $recipe));

    $this->assertDatabaseHas('tags', ['name' => 'Bio']);
    $this->assertDatabaseHas('tags', ['name' => 'BBQ']);
});

test('tag cannot have empty name', function () {
    $recipe = recipeResourceFor($this->user);

    actingAs($this->user)
        ->put(route('recipes.update', $recipe), [
            'name' => $recipe->name,
            'description' => $recipe->description,
            'serving_size' => $recipe->serving_size,
            'preparation_time' => $recipe->preparation_time,
            'cooking_time' => $recipe->cooking_time,
            'meal_times' => [],
            'ingredients' => [],
            'steps' => [],
            'tags' => [
                ['name' => ''],
            ],
        ])
        ->assertRedirect()
        ->assertSessionHasErrors(['tags.0.name']);
});
