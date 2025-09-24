<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class RecipeIngredient extends Pivot
{
    use HasFactory;

    protected $fillable = [
        "recipe_id",
        "ingredient_id",
        "quantity",
        "unit",
    ];

    /**
     * @return BelongsTo<Recipe, $this, Pivot>
     */
    public function Recipes(): BelongsTo
    {
        return $this->belongsTo(Recipe::class);
    }

    /**
     * @return BelongsTo<Ingredient, $this, Pivot>
     */
    public function Ingredients(): BelongsTo
    {
        return $this->belongsTo(Ingredient::class);
    }
}
