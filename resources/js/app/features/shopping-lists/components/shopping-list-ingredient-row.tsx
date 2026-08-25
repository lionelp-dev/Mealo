import { useWorkspacePermissions } from '@/app/hooks/use-workspace-permissions';
import { cn } from '@/app/lib/';
import { capitalize } from '@/app/utils/';
import { router } from '@inertiajs/react';
import { useState } from 'react';

type ShoppingListIngredientRowProps = {
  checked: boolean;
  isLoading?: boolean;
  name: string;
  onTogglePayload: () => {
    planned_meal_id: number;
    ingredient_id: string | number;
    shopping_list_id: number;
    is_checked: boolean;
  }[];
  quantity: number;
  unit: string;
};

export default function ShoppingListIngredientRow({
  checked,
  isLoading: externalIsLoading = false,
  name,
  onTogglePayload,
  quantity,
  unit,
}: ShoppingListIngredientRowProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { canEditShoppingList } = useWorkspacePermissions();

  const toggleChecked = async () => {
    if (isLoading || externalIsLoading) return;

    router.put(
      `/shopping-lists`,
      {
        shopping_list_planned_meal_ingredients: onTogglePayload(),
      },
      {
        preserveScroll: true,
        onFinish: () => setIsLoading(false),
        onError: () => setIsLoading(false),
      },
    );

    setIsLoading(true);
  };

  return (
    <label
      className={cn(
        'flex items-center gap-5 px-5 select-none',
        checked
          ? 'bg-gray-100/50 hover:bg-secondary/15'
          : 'hover:bg-secondary/5',
        (isLoading || externalIsLoading) && 'opacity-50',
      )}
    >
      <div className="grid w-full grid-cols-[auto_1fr] grid-rows-[2.35rem_auto] items-center gap-x-4 py-1">
        {canEditShoppingList && (
          <input
            type="checkbox"
            checked={checked}
            onChange={toggleChecked}
            disabled={isLoading || externalIsLoading}
            className={cn(
              'checkbox flex-shrink-0 checkbox-xs hover:checkbox-secondary',
              checked && 'checkbox-secondary',
            )}
          />
        )}

        <span className="flex h-full min-w-0 items-center justify-between gap-1">
          <span
            className={cn(
              'flex-1 items-center gap-2 truncate text-base font-medium text-base-content transition-all duration-200',
              checked && 'line-through',
            )}
          >
            {capitalize(name)}
          </span>
          <span className="shrink-0 text-sm text-base-content/70 transition-all duration-200">
            {quantity} {unit}
          </span>
        </span>
      </div>
    </label>
  );
}
