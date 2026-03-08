<?php

namespace App\Data\Recipe;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class RecipeRequest extends Data
{
    public function __construct(
        #[Required, Max(255)]
        public string $name,
        #[Required]
        public ?string $description,
        #[Required, Min(1), Max(50)]
        public int $serving_size,
        #[Required, Min(0)]
        public int $preparation_time,
        #[Required, Min(0)]
        public int $cooking_time,
        /** @var MealTimeData[] */
        #[Required]
        public array $meal_times,
        /** @var IngredientData[] */
        #[Required]
        public array $ingredients,
        /** @var StepData[] */
        #[Required]
        public array $steps,
        /** @var TagData[] */
        public array $tags,
        public ?string $image = null,
    ) {}
}
