<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $shopping_list_id
 * @property int $planned_meal_id
 * @property string $ingredient_id
 * @property string $unit
 * @property bool $is_checked
 */
class ShoppingListPlannedMealIngredient extends Model
{
    /** @use HasFactory<\Database\Factories\ShoppingListPlannedMealIngredientFactory> */
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
     * @return BelongsTo<ShoppingList, $this>
     */
    public function shoppingList(): BelongsTo
    {
        return $this->belongsTo(ShoppingList::class);
    }

    /**
     * @return BelongsTo<PlannedMeal, $this>
     */
    public function plannedMeal(): BelongsTo
    {
        return $this->belongsTo(PlannedMeal::class);
    }

    /**
     * @return BelongsTo<Ingredient, $this>
     */
    public function ingredient(): BelongsTo
    {
        return $this->belongsTo(Ingredient::class);
    }
}
