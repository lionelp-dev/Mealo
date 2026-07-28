<?php

namespace App\Data\Resources\ShoppingList;

use App\Actions\ShoppingList\ShoppingListAggregateByIngredientAction;
use App\Actions\ShoppingList\ShoppingListGroupByRecipeAction;
use App\Models\ShoppingList;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class ShoppingListResourceData extends Data
{
    public function __construct(
        public int $id,
        public int $user_id,
        public int $workspace_id,
        public string $week_start,

        /** @var array{checked: array<int, array<string, mixed>>, unchecked: array<int, array<string, mixed>>} */
        #[LiteralTypeScriptType('{ checked: PlannedMealIngredient[]; unchecked: PlannedMealIngredient[] }')]
        public array $by_ingredients,

        /** @var array<int, array<string, mixed>> */
        #[LiteralTypeScriptType('Array<{ recipe_id: number; recipe_name: string; ingredients: { checked: PlannedMealRecipeIngredient[]; unchecked: PlannedMealRecipeIngredient[] } }>')]
        public array $by_recipes,

        public ?CarbonImmutable $created_at,
        public ?CarbonImmutable $updated_at,
    ) {}

    public static function fromModel(ShoppingList $shoppingList): self
    {
        return new self(
            id: $shoppingList->id,
            user_id: $shoppingList->user_id,
            workspace_id: $shoppingList->workspace_id,
            week_start: $shoppingList->week_start->toDateString(),
            by_ingredients: app(ShoppingListAggregateByIngredientAction::class)($shoppingList),
            by_recipes: app(ShoppingListGroupByRecipeAction::class)($shoppingList),
            created_at: $shoppingList->created_at?->toImmutable(),
            updated_at: $shoppingList->updated_at?->toImmutable(),
        );
    }
}
