<?php

namespace App\Data\Requests\ShoppingList\Entities;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class ShoppingListPlannedMealIngredientRequestData extends Data
{
    public function __construct(
        public int $shopping_list_id,
        public int $planned_meal_id,
        public string $ingredient_id,
        public bool $is_checked,
    ) {}

    /**
     * @return array<string, array<string>>
     */
    public static function rules(): array
    {
        return [
            'shopping_list_id' => ['required', 'integer'],
            'planned_meal_id' => ['required', 'integer'],
            'ingredient_id' => ['required', 'string'],
            'is_checked' => ['required', 'boolean:strict'],
        ];
    }
}
