<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Step extends Model
{
    /** @use HasFactory<\Database\Factories\StepFactory> */
    use HasFactory;

    protected $fillable = [
        'recipe_id',
        'order',
        'description',
    ];

    /**
     *  @return BelongsTo<Recipe,$this>
     */
    public function recipes(): BelongsTo
    {
        return $this->belongsTo(Recipe::class);
    }
}
