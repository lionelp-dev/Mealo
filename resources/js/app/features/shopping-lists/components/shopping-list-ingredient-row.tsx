import { useWorkspacePermissions } from '@/app/hooks/use-workspace-permissions';
import { cn } from '@/app/lib/';
import { capitalize } from '@/app/utils/';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { i18n, t } = useTranslation();
  const { canEditShoppingList } = useWorkspacePermissions();
  const formattedQuantity = new Intl.NumberFormat(
    i18n.resolvedLanguage ?? i18n.language,
    { maximumFractionDigits: 2 },
  ).format(quantity);

  const toggleChecked = async () => {
    if (!canEditShoppingList || isLoading || externalIsLoading) return;

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
        'flex min-h-10 items-center gap-3 rounded-sm px-0.5 py-2 transition-colors select-none hover:bg-secondary/5',
        canEditShoppingList && 'cursor-pointer',
        checked && 'text-base-content/45',
        (isLoading || externalIsLoading) && 'opacity-50',
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={toggleChecked}
        disabled={!canEditShoppingList || isLoading || externalIsLoading}
        className={cn(
          'checkbox size-5 shrink-0 rounded-full border-base-300 checkbox-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary disabled:opacity-60',
          canEditShoppingList && 'hover:checkbox-secondary',
          checked && 'checkbox-secondary',
        )}
      />

      <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
        <span
          title={capitalize(name)}
          className={cn(
            'min-w-0 flex-1 text-sm leading-snug font-medium wrap-anywhere transition-colors',
            checked && 'line-through',
          )}
        >
          {capitalize(name)}
        </span>
        <span
          className={cn(
            'shrink-0 text-sm whitespace-nowrap tabular-nums',
            checked ? 'text-base-content/40' : 'text-base-content/70',
          )}
        >
          {formattedQuantity}{' '}
          {t(`ingredientUnits.${unit}`, { defaultValue: unit })}
        </span>
      </span>
    </label>
  );
}
