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
        'workspace_id',
        'week_start',
    ];

    protected $casts = [
        'week_start' => 'date',
    ];

    /**
     * @return BelongsTo<User,ShoppingList>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Workspace,ShoppingList>
     */
    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    /**
     * @return HasMany<ShoppingListIngredient,ShoppingList>
     */
    public function plannedMealIngredients(): HasMany
    {
        return $this->hasMany(ShoppingListPlannedMealIngredient::class);
    }
}
