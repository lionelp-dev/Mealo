import { ShoppingListIngredient } from '@/types';
import ShoppingListIngredientItem from './shopping-list-ingredient-item';

type ShoppingListIngredientSectionProps = {
  title: string;
  description: string;
  ingredients: ShoppingListIngredient[];
  className?: string;
};

function ShoppingListIngredientList({
  title,
  description,
  ingredients,
}: ShoppingListIngredientSectionProps) {
  return (
    <div
      className={`flex flex-1 flex-col overflow-hidden rounded-md border border-base-300 bg-base-100`}
    >
      <div className="border-b border-base-300 px-7 py-4">
        <h3 className="font-medium text-base-content">{title}</h3>
        <p className="text-sm text-base-content">{description}</p>
      </div>
      <div className="flex flex-col overflow-y-scroll">
        <div className="divide-y divide-base-300">
          {ingredients.map((ingredient) => (
            <ShoppingListIngredientItem
              key={ingredient.id}
              ingredient={ingredient}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ShoppingListIngredientList;
