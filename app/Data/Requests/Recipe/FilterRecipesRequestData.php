<?php

namespace App\Data\Requests\Recipe;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class FilterRecipesRequestData extends Data
{
    public function __construct(
        #[Optional]
        public ?string $search = null,
        /** @var array<int>|null $tags */
        #[Optional]
        public ?array $tags = null,
        /** @var array<int>|null $meal_times */
        #[Optional]
        public ?array $meal_times = null,
        #[Optional]
        public ?string $preparation_time = null,
        #[Optional]
        public ?string $cooking_time = null,
    ) {}

    /**
     * @return array<string, string>
     */
    public static function rules(): array
    {
        return [
            'search' => 'sometimes|required|string|max:255',
            'tags' => 'sometimes|required|array',
            'tags.*' => 'integer|exists:tags,id',
            'meal_times' => 'sometimes|required|array',
            'meal_times.*' => 'integer|exists:meal_times,id',
            'preparation_time' => 'sometimes|required|string|in:[0..15],[15..30],[30..60],>60',
            'cooking_time' => 'sometimes|required|string|in:[0..15],[15..30],[30..60],>60',
        ];
    }
}
