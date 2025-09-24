<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class RecipeTag extends Pivot
{
    protected $fillable = [
        'recipe_id',
        'tag_id',
    ];

    /**
     * @return BelongsTo<Recipe, $this>
     */
    public function recipes(): BelongsTo
    {
        return $this->belongsTo(Recipe::class);
    }

    /**
     * @return BelongsTo<Tag, $this>
     */
    public function tags(): BelongsTo
    {
        return $this->belongsTo(Tag::class);
    }
}
