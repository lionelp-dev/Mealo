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
    /** @use HasFactory<\Illuminate\Database\Eloquent\Factories\Factory<ShoppingList>> */
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
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Workspace, $this>
     */
    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    /**
     * @return HasMany<ShoppingListPlannedMealIngredient, $this>
     */
    public function plannedMealIngredients(): HasMany
    {
        return $this->hasMany(ShoppingListPlannedMealIngredient::class);
    }
}
