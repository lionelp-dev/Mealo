import { cn } from '@/app/lib/';
import { Children, ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';

const DEFAULT_VISIBLE_COUNT = 8;

type ShoppingListCardProps = {
  children: ReactNode;
  isComplete?: boolean;
  subtitle?: ReactNode;
  title: string;
};

export default function ShoppingListCard({
  children,
  isComplete = false,
  subtitle,
  title,
}: ShoppingListCardProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const childArray = Children.toArray(children);
  const totalCount = childArray.length;
  const hasMore = totalCount > DEFAULT_VISIBLE_COUNT;
  const visibleChildren = isExpanded
    ? childArray
    : childArray.slice(0, DEFAULT_VISIBLE_COUNT);
  const hiddenCount = totalCount - DEFAULT_VISIBLE_COUNT;

  return (
    <section className="flex h-fit flex-col overflow-hidden rounded-xl border border-base-200 bg-base-100">
      <div className="border-b-2 border-secondary/70 px-4 py-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <span
            className={cn(
              'truncate text-base font-bold text-base-content transition-all duration-200',
              isComplete && 'text-base-content/50 line-through',
            )}
          >
            {title}
          </span>
          {subtitle && (
            <span
              className={cn(
                'text-xs text-base-content/60 transition-all duration-200',
                isComplete && 'text-base-content/40',
              )}
            >
              {subtitle}
            </span>
          )}
        </div>
      </div>

      <div className="divide-y divide-base-200">
        {visibleChildren}
      </div>

      {hasMore && (
        <button
          onClick={() => setIsExpanded((expanded) => !expanded)}
          className="border-t border-base-200 px-4 py-3 text-left text-sm font-semibold text-secondary hover:underline"
        >
          {isExpanded
            ? t('shoppingLists.showLess', 'Réduire')
            : t('shoppingLists.showMore', {
                count: hiddenCount,
                defaultValue: 'Voir les {{count}} autres',
              })}
        </button>
      )}
    </section>
  );
}
