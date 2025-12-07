<?php

namespace App\Models;

use App\Policies\ShoppingListPolicy;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[UsePolicy(ShoppingListPolicy::class)]
class ShoppingList extends Model
{
    use HasFactory;

    protected $table = 'shopping_lists';

    protected $fillable = [
        'user_id',
        'week_start',
    ];

    protected $casts = [
        'week_start' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function ingredients(): HasMany
    {
        return $this->hasMany(ShoppingListIngredient::class);
    }

    public function ingredientsWithDetails(): HasMany
    {
        return $this->ingredients()->with('ingredient');
    }
}
