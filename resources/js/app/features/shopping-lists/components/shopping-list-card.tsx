import {
  getShoppingListTone,
  type ShoppingListAppearance,
} from './shopping-list-appearance';
import { Typography } from '@/app/components/Typography';
import { cn } from '@/app/lib/';
import { ChevronDown } from 'lucide-react';
import { Children, ReactNode, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';

const DEFAULT_VISIBLE_COUNT = 5;

type ShoppingListCardProps = {
  children: ReactNode;
  isComplete?: boolean;
  appearance: ShoppingListAppearance;
  title: string;
};

export default function ShoppingListCard({
  children,
  isComplete = false,
  appearance,
  title,
}: ShoppingListCardProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const contentId = useId();
  const titleId = useId();
  const illustrationColumn = appearance.illustrationIndex % 6;
  const illustrationRow = Math.floor(appearance.illustrationIndex / 6);

  const childArray = Children.toArray(children);
  const totalCount = childArray.length;
  const hasMore = totalCount > DEFAULT_VISIBLE_COUNT;
  const visibleChildren = isExpanded
    ? childArray
    : childArray.slice(0, DEFAULT_VISIBLE_COUNT);
  const hiddenCount = totalCount - DEFAULT_VISIBLE_COUNT;

  return (
    <section
      aria-labelledby={titleId}
      className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-base-300/50 bg-base-100 p-1.5 shadow-[0_2px_8px_rgba(45,65,90,0.04)]"
    >
      <div
        className={cn(
          'flex items-center gap-3 rounded-xl px-3 py-2.5',
          getShoppingListTone(appearance.tone),
        )}
      >
        <div className="min-w-0 flex-1">
          <Typography
            as="h2"
            variant="body-lg"
            id={titleId}
            tone={isComplete ? 'muted' : 'default'}
            className={cn(isComplete && 'line-through')}
          >
            {title}
          </Typography>
          <Typography
            as="span"
            variant="caption"
            weight="medium"
            className="mt-0.5 block tabular-nums"
          >
            {t('shoppingLists.itemsCount', { count: totalCount })}
          </Typography>
        </div>
        <span
          className="size-11 shrink-0 rounded-full bg-current/10 bg-no-repeat"
          aria-hidden="true"
          style={{
            backgroundImage: 'url(/images/shopping-categories.png)',
            backgroundSize: '600% 400%',
            backgroundPosition: `${(illustrationColumn / 5) * 100}% ${(illustrationRow / 3) * 100}%`,
          }}
        />
      </div>

      <div id={contentId} className="mx-3 divide-y divide-base-300/60 py-1">
        {visibleChildren}
      </div>

      {hasMore && (
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-controls={contentId}
          onClick={() => setIsExpanded((expanded) => !expanded)}
          className="mt-auto flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-secondary hover:bg-secondary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
        >
          {isExpanded
            ? t('shoppingLists.showLess', 'Réduire')
            : t('shoppingLists.showMore', {
                count: hiddenCount,
                defaultValue: 'Voir les {{count}} autres',
              })}
          <ChevronDown
            aria-hidden="true"
            className={cn(
              'size-4 shrink-0 transition-transform',
              isExpanded && 'rotate-180',
            )}
          />
        </button>
      )}
    </section>
  );
}
