<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShoppingListPlannedMealIngredient extends Model
{
    use HasFactory;

    protected $table = 'shopping_list_planned_meal_ingredients';

    protected $fillable = [
        'shopping_list_id',
        'planned_meal_id',
        'ingredient_id',
        'unit',
        'is_checked',
    ];

    protected $casts = [
        'is_checked' => 'boolean',
    ];

    /**
     * @return BelongsTo<ShoppingList,ShoppingListPlannedMealIngredient>
     */
    public function shoppingList(): BelongsTo
    {
        return $this->belongsTo(ShoppingList::class);
    }

    /**
     * @return BelongsTo<PlannedMeal,ShoppingListPlannedMealIngredient>
     */
    public function plannedMeal(): BelongsTo
    {
        return $this->belongsTo(PlannedMeal::class);
    }

    /**
     * @return BelongsTo<Ingredient,ShoppingListPlannedMealIngredient>
     */
    public function ingredient(): BelongsTo
    {
        return $this->belongsTo(Ingredient::class);
    }
}
