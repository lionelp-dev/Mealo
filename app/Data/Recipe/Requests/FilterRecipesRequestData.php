<?php

namespace App\Data\Recipe\Requests;

use Spatie\LaravelData\Attributes\Validation\ArrayType;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

class FilterRecipesRequestData extends Data
{
    public function __construct(
        #[Nullable, StringType, Max(255)]
        public ?string $search = null,

        /** @var array<int>|null */
        #[Nullable, ArrayType, Rule('nullable', 'array', 'integer', 'exists:tags,id')]
        public ?array $tags = null,

        /** @var array<int>|null */
        #[Nullable, ArrayType, Rule('nullable', 'array', 'integer', 'exists:meal_times,id')]
        public ?array $meal_times = null,
        #[Nullable, StringType, In('[0..15]', '[15..30]', '[30..60]', '>60')]
        public ?string $preparation_time = null,
        #[Nullable, StringType, In('[0..15]', '[15..30]', '[30..60]', '>60')]
        public ?string $cooking_time = null,
    ) {}
}
