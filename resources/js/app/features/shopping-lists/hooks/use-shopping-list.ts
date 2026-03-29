import { useShoppingListsContextValue } from '../inertia.adapter';
import { ShoppingList } from '@/types';
import { useState } from 'react';

export function useShoppingList() {
  const { shopping_list_data } = useShoppingListsContextValue();
  const shoppingList: ShoppingList = shopping_list_data;
  const shopping_list_by_ingredients = shoppingList.by_ingredients ?? {
    checked: [],
    unchecked: [],
  };
  const shopping_list_by_recipes = shoppingList.by_recipes ?? [];
  const checkedCount = shopping_list_by_ingredients.checked.length;
  const uncheckedCount = shopping_list_by_ingredients.unchecked.length;
  const uncheckedIngredients = shopping_list_by_ingredients.unchecked;
  const checkedIngredients = shopping_list_by_ingredients.checked;
  const total = uncheckedCount + checkedCount;

  const [viewMode, setViewMode] = useState<'ingredients' | 'recipes'>(
    'ingredients',
  );

  return {
    shoppingList,
    shopping_list_by_ingredients,
    shopping_list_by_recipes,
    checkedCount,
    uncheckedCount,
    uncheckedIngredients,
    checkedIngredients,
    total,
    viewMode,
    setViewMode,
  };
}
