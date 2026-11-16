import { cn } from '@/app/lib';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';

type ShoppingListProgressProps = {
  checkedCount: number;
  className?: string;
  totalCount: number;
};

function ShoppingListProgress({
  checkedCount,
  className,
  totalCount,
}: ShoppingListProgressProps) {
  const { t } = useTranslation();
  const labelId = useId();

  const progressPercentage =
    totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;
  const roundedProgressPercentage = Math.round(progressPercentage);

  return (
    <div
      className={cn(className, 'flex flex-1 items-center justify-end gap-3')}
    >
      <span className="shrink-0 text-sm font-semibold whitespace-nowrap text-base-content sm:text-base">
        {roundedProgressPercentage} %
      </span>
      <progress
        aria-labelledby={labelId}
        className="progress col-span-2 col-start-1 row-start-2 h-2.5 w-full progress-secondary sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:h-3"
        value={progressPercentage}
        max="100"
      />
      <span
        id={labelId}
        className="text-sm font-semibold whitespace-nowrap text-base-content sm:text-base"
      >
        {t('shoppingLists.progress', {
          checked: checkedCount,
          defaultValue: '{{checked}} sur {{total}} cochés',
          total: totalCount,
        })}
      </span>
    </div>
  );
}

export default ShoppingListProgress;
