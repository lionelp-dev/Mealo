<?php

namespace App\Data\Recipe;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class RecipeResource extends Data
{
    public function __construct(
        public int $id,
        public int $user_id,
        public string $name,
        public ?string $description,
        public int $serving_size,
        public int $preparation_time,
        public int $cooking_time,
        /** @var MealTimeData[] */
        public array $meal_times,
        /** @var IngredientData[] */
        public array $ingredients,
        /** @var StepData[] */
        public array $steps,
        /** @var TagData[] */
        public array $tags,
        public ?string $image_url,
        public string $created_at,
        public string $updated_at,
    ) {}
}
