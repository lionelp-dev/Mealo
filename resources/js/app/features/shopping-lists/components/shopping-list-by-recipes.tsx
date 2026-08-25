import { useShoppingList } from '../hooks/use-shopping-list';
import ShoppingListCard from './shopping-list-card';
import ShoppingListIngredientRow from './shopping-list-ingredient-row';
import { ShoppingList } from '@/types';
import { useTranslation } from 'react-i18next';

type ShoppingListRecipe = ShoppingList['by_recipes'][number];

function ShoppingListRecipeCard({ recipe }: { recipe: ShoppingListRecipe }) {
  const { t } = useTranslation();
  const totalIngredients =
    recipe.ingredients.unchecked.length + recipe.ingredients.checked.length;
  const isRecipeCompleted =
    totalIngredients > 0 &&
    recipe.ingredients.checked.length === totalIngredients;
  const subtitle = t('shoppingLists.listProgress', {
    checked: recipe.ingredients.checked.length,
    defaultValue: '{{checked}} sur {{total}}',
    total: totalIngredients,
  });

  return (
    <ShoppingListCard
      subtitle={subtitle}
      title={recipe.recipe_name}
      isComplete={isRecipeCompleted}
    >
      {recipe.ingredients.unchecked.map((ingredient) => (
        <ShoppingListIngredientRow
          key={`${ingredient.shopping_list_id}-${ingredient.ingredient_id}-${ingredient.unit}-${ingredient.is_checked}`}
          checked={ingredient.is_checked}
          name={ingredient.name}
          onTogglePayload={() =>
            ingredient.from_planned_meals.map((planned_meal) => {
              return {
                shopping_list_id: ingredient.shopping_list_id,
                planned_meal_id: planned_meal.planned_meal_id,
                ingredient_id: ingredient.ingredient_id,
                is_checked: !planned_meal.is_checked,
              };
            })
          }
          quantity={ingredient.total_quantity}
          unit={ingredient.unit}
        />
      ))}

      {recipe.ingredients.checked.map((ingredient) => (
        <ShoppingListIngredientRow
          key={`${ingredient.shopping_list_id}-${ingredient.ingredient_id}-${ingredient.unit}-${ingredient.is_checked}`}
          checked={ingredient.is_checked}
          name={ingredient.name}
          onTogglePayload={() =>
            ingredient.from_planned_meals.map((planned_meal) => {
              return {
                shopping_list_id: ingredient.shopping_list_id,
                planned_meal_id: planned_meal.planned_meal_id,
                ingredient_id: ingredient.ingredient_id,
                is_checked: !planned_meal.is_checked,
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

export default function ShoppingListByRecipes() {
  const { shopping_list_by_recipes } = useShoppingList();

  const recipesWithIngredients = shopping_list_by_recipes
    .filter(
      (recipe) =>
        recipe.ingredients.unchecked.length +
          recipe.ingredients.checked.length >
        0,
    )
    .sort((left, right) => {
      const leftCount =
        left.ingredients.unchecked.length + left.ingredients.checked.length;
      const rightCount =
        right.ingredients.unchecked.length + right.ingredients.checked.length;
      const countDifference = rightCount - leftCount;

      if (countDifference !== 0) {
        return countDifference;
      }

      const nameDifference = left.recipe_name.localeCompare(
        right.recipe_name,
        undefined,
        {
          sensitivity: 'base',
        },
      );

      if (nameDifference !== 0) {
        return nameDifference;
      }

      return left.recipe_id - right.recipe_id;
    });

  return (
    <>
      {recipesWithIngredients.map((recipe) => (
        <ShoppingListRecipeCard key={recipe.recipe_id} recipe={recipe} />
      ))}
    </>
  );
}
