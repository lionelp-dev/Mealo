import { cn } from '@/app/lib/';
import { ReactNode } from 'react';

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
  return (
    <section className="flex h-fit flex-col gap-3">
      <div
        className={cn(
          'flex max-w-full items-start font-medium text-base-content',
        )}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-0.25">
          <span
            className={cn(
              'truncate text-lg font-medium text-secondary transition-all duration-200',
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

      <div className="divide-y divide-base-200 overflow-hidden rounded-xl border border-base-200 bg-base-100">
        {children}
      </div>
    </section>
  );
}
