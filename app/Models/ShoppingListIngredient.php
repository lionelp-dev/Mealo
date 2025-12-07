<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShoppingListIngredient extends Model
{
    use HasFactory;

    protected $table = 'shopping_list_ingredients';

    protected $fillable = [
        'shopping_list_id',
        'ingredient_id',
        'quantity',
        'unit',
        'is_checked',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'is_checked' => 'boolean',
    ];

    public function shoppingList(): BelongsTo
    {
        return $this->belongsTo(ShoppingList::class);
    }

    public function ingredient(): BelongsTo
    {
        return $this->belongsTo(Ingredient::class);
    }
}
