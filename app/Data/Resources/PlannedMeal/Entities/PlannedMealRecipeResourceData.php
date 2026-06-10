<?php

namespace App\Data\Resources\PlannedMeal\Entities;

use App\Models\Recipe;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class PlannedMealRecipeResourceData extends Data
{
    public function __construct(
        public string $id,
        public string $name,
        public ?string $image_url,
    ) {}

    public static function fromModel(Recipe $recipe): self
    {
        return new self(
            id: $recipe->id,
            name: $recipe->name,
            image_url: $recipe->getImageUrl(),
        );
    }
}
