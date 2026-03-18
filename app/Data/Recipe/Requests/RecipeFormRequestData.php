<?php

namespace App\Data\Recipe\Requests;

use Spatie\LaravelData\Attributes\Validation\BooleanType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

class RecipeFormRequestData extends Data
{
    public function __construct(
        #[Nullable, StringType, Max(255)]
        public ?string $ingredients_search = null,
        #[Nullable, StringType, Max(255)]
        public ?string $tags_search = null,
        #[Nullable, BooleanType]
        public ?bool $show_generate_recipe_with_ai_modal = null,
    ) {}
}
