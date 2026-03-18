<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class RecipeIngredient extends Pivot
{
    /** @use HasFactory<\Database\Factories\RecipeIngredientFactory> */
    use HasFactory;

    protected $fillable = [
        'recipe_id',
        'ingredient_id',
        'quantity',
        'unit',
    ];

    /**
     * @return BelongsTo<Recipe, $this>
     */
    public function Recipe(): BelongsTo
    {
        return $this->belongsTo(Recipe::class);
    }

    /**
     * @return BelongsTo<Ingredient, $this>
     */
    public function Ingredient(): BelongsTo
    {
        return $this->belongsTo(Ingredient::class);
    }
}
