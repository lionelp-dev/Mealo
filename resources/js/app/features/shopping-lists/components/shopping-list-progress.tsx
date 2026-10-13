import { cn } from '@/app/lib';
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

  const progressPercentage =
    totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  return (
    <div className={cn('flex w-full shrink-0 items-center gap-3', className)}>
      <span className="shrink-0 text-sm font-medium text-base-content/70">
        {t('shoppingLists.progress', {
          checked: checkedCount,
          defaultValue: '{{checked}} sur {{total}} cochés',
          total: totalCount,
        })}
      </span>
      <progress
        className="progress flex-1 progress-secondary"
        value={progressPercentage}
        max="100"
      />
    </div>
  );
}

export default ShoppingListProgress;
