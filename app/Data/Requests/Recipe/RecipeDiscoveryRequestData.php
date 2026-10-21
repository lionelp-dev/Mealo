<?php

namespace App\Data\Requests\Recipe;

use App\Enums\MealTimeEnum;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Data;

class RecipeDiscoveryRequestData extends Data
{
    /**
     * @param  list<string>  $meal_times
     */
    public function __construct(
        public string $prompt,
        public array $meal_times = [],
    ) {}

    /**
     * @return array<string, mixed>
     */
    public static function rules(): array
    {
        return [
            'prompt' => 'required|string|min:3|max:5000',
            'meal_times' => 'sometimes|array|max:4',
            'meal_times.*' => ['string', Rule::in(MealTimeEnum::values()), 'distinct'],
        ];
    }
}
