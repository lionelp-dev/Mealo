import { useShoppingList } from '../hooks/use-shopping-list';
import ShoppingListCard from './shopping-list-card';
import ShoppingListIngredientRow from './shopping-list-ingredient-row';
import { PlannedMealIngredient } from '@/types';
import { useTranslation } from 'react-i18next';

type IngredientCategoryGroup = {
  id: number;
  name: string;
  ingredients: PlannedMealIngredient[];
  checkedCount: number;
};

function groupIngredientsByCategory(
  ingredients: PlannedMealIngredient[],
): IngredientCategoryGroup[] {
  const groups = new Map<number, IngredientCategoryGroup>();

  ingredients.forEach((ingredient) => {
    const existingGroup = groups.get(ingredient.category_id);

    if (existingGroup) {
      existingGroup.ingredients.push(ingredient);
      existingGroup.checkedCount += ingredient.is_checked ? 1 : 0;
      return;
    }

    groups.set(ingredient.category_id, {
      id: ingredient.category_id,
      name: ingredient.category_name,
      ingredients: [ingredient],
      checkedCount: ingredient.is_checked ? 1 : 0,
    });
  });

  return Array.from(groups.values()).sort((left, right) => {
    const countDifference = right.ingredients.length - left.ingredients.length;

    if (countDifference !== 0) {
      return countDifference;
    }

    const nameDifference = left.name.localeCompare(right.name, undefined, {
      sensitivity: 'base',
    });

    if (nameDifference !== 0) {
      return nameDifference;
    }

    return left.id - right.id;
  });
}

function getCategoryCompletionState(category: IngredientCategoryGroup) {
  const totalIngredients = category.ingredients.length;
  const isCategoryComplete =
    totalIngredients > 0 && category.checkedCount === totalIngredients;

  return {
    isCategoryComplete,
  };
}

function IngredientCategoryCard({
  category,
}: {
  category: IngredientCategoryGroup;
}) {
  const { t } = useTranslation();
  const { isCategoryComplete } = getCategoryCompletionState(category);
  const subtitle = t('shoppingLists.listProgress', {
    checked: category.checkedCount,
    defaultValue: '{{checked}} sur {{total}}',
    total: category.ingredients.length,
  });

  return (
    <ShoppingListCard
      subtitle={subtitle}
      title={category.name}
      isComplete={isCategoryComplete}
    >
      {category.ingredients.map((ingredient) => (
        <ShoppingListIngredientRow
          key={`${ingredient.shopping_list_id}-${ingredient.ingredient_id}-${ingredient.unit}`}
          checked={ingredient.is_checked}
          name={ingredient.name}
          onTogglePayload={() =>
            ingredient.from_planned_meals.map((item) => {
              return {
                shopping_list_id: ingredient.shopping_list_id,
                planned_meal_id: item.planned_meal_id,
                ingredient_id: ingredient.ingredient_id,
                is_checked: !ingredient.is_checked,
              };
            })
          }
          quantity={ingredient.total_quantity}
          unit={ingredient.unit}
        />
      ))}
    </ShoppingListCard>
  );
}

function IngredientCategoriesWrap({
  categories,
}: {
  categories: IngredientCategoryGroup[];
}) {
  return (
    <>
      {categories.map((category) => (
        <IngredientCategoryCard key={category.id} category={category} />
      ))}
    </>
  );
}

export function ShoppingListByIngredientCategories() {
  const { shopping_list_by_ingredients } = useShoppingList();
  const categories = groupIngredientsByCategory([
    ...shopping_list_by_ingredients.unchecked,
    ...shopping_list_by_ingredients.checked,
  ]);

  return <IngredientCategoriesWrap categories={categories} />;
}
