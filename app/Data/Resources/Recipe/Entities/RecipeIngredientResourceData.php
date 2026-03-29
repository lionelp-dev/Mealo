<?php

namespace App\Data\Resources\Recipe\Entities;

use App\Models\Ingredient;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class RecipeIngredientResourceData extends Data
{
    public function __construct(
        public string $id,
        public string $name,
        public float $quantity,
        public string $unit,
    ) {}

    public static function fromModel(Ingredient $ingredient): self
    {
        return new self(
            $ingredient->id,
            $ingredient->name,
            $ingredient->pivot->quantity,
            $ingredient->pivot->unit,
        );
    }
}
