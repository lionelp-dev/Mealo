import { cn } from '@/app/lib/';
import { type ClassValue } from 'clsx';
import { forwardRef, type PropsWithChildren } from 'react';

type PageContainerSize = 'default' | 'wide' | 'full' | 'narrow';

type Props = {
  className?: ClassValue;
  contentClassName?: ClassValue;
  size?: PageContainerSize;
} & PropsWithChildren;

const contentSizeClasses: Record<PageContainerSize, ClassValue> = {
  default: 'mx-auto max-w-[1600px]',
  wide: 'mx-auto max-w-[1800px]',
  narrow: 'mx-auto max-w-4xl',
  full: '',
};

export const PageContainer = forwardRef<HTMLDivElement, Props>(
  ({ children, className, contentClassName, size = 'default' }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-y-auto bg-[#f6f7f9] py-8',
          className,
        )}
      >
        <div
          className={cn(
            'w-full min-w-0 px-3.75 md:px-6.75',
            contentSizeClasses[size],
            contentClassName,
          )}
        >
          {children}
        </div>
      </div>
    );
  },
);

PageContainer.displayName = 'PageContainer';
