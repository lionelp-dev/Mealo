import { router } from '@inertiajs/react';
import { useState } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { ShoppingListIngredient } from '@/types';

type ShoppingListIngredientItemProps = {
  ingredient: ShoppingListIngredient;
};

export default function ShoppingListIngredientItem({
  ingredient,
}: ShoppingListIngredientItemProps) {
  const [isLoading, setIsLoading] = useState(false);

  const toggleChecked = async () => {
    if (isLoading) return;

    setIsLoading(true);

    router.put(
      `/shopping-lists/ingredients/${ingredient.id}`,
      { is_checked: !ingredient.is_checked },
      {
        preserveScroll: true,
        onFinish: () => setIsLoading(false),
        onError: () => setIsLoading(false),
      },
    );
  };

  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-5 px-7 py-2 transition-all duration-200 select-none',
        ingredient.is_checked
          ? 'bg-base-200 hover:bg-base-200'
          : 'bg-base-100 hover:bg-base-200',
        isLoading && 'opacity-50',
      )}
    >
      <Checkbox
        checked={ingredient.is_checked}
        onCheckedChange={toggleChecked}
        disabled={isLoading}
        className="flex-shrink-0"
      />

      <div className="flex min-w-0 flex-col gap-1">
        <div
          className={cn(
            'font-medium text-base-content transition-all duration-200',
            ingredient.is_checked && 'line-through',
          )}
        >
          {ingredient.ingredient.name}
        </div>
        <div
          className={cn(
            'text-sm text-base-content transition-all duration-200',
          )}
        >
          {ingredient.quantity} {ingredient.unit}
        </div>
      </div>
    </label>
  );
}
