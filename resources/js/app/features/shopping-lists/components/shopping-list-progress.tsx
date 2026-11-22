import { Typography } from '@/app/components/Typography';
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
      <Typography
        as="span"
        variant="body-sm"
        weight="semibold"
        className="shrink-0 whitespace-nowrap"
      >
        {roundedProgressPercentage} %
      </Typography>
      <progress
        aria-labelledby={labelId}
        className="progress col-span-2 col-start-1 row-start-2 h-2.5 w-full progress-secondary sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:h-3"
        value={progressPercentage}
        max="100"
      />
      <Typography
        as="span"
        variant="body-sm"
        id={labelId}
        weight="semibold"
        className="whitespace-nowrap"
      >
        {t('shoppingLists.progress', {
          checked: checkedCount,
          defaultValue: '{{checked}} sur {{total}} cochés',
          total: totalCount,
        })}
      </Typography>
    </div>
  );
}

export default ShoppingListProgress;
