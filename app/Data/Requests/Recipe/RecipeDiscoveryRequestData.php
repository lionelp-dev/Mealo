<?php

namespace App\Data\Requests\Recipe;

use Spatie\LaravelData\Data;

class RecipeDiscoveryRequestData extends Data
{
    public function __construct(
        public string $prompt,
    ) {}

    /**
     * @return array<string, string>
     */
    public static function rules(): array
    {
        return [
            'prompt' => 'required|string|min:3|max:5000',
        ];
    }
}
