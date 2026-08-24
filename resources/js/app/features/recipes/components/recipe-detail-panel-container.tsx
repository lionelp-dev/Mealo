import { cn } from '@/app/lib';
import { type ReactNode } from 'react';

type RecipeDetailPanelContainerProps = {
  isMounted: boolean;
  isVisible: boolean;
  children: ReactNode;
  className?: string;
};

export default function RecipeDetailPanelContainer({
  isMounted,
  isVisible,
  children,
  className,
}: RecipeDetailPanelContainerProps) {
  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={cn(
        'bottom-3 z-10 h-[70vh] shrink-0 overflow-hidden',
        'max-lg:absolute max-lg:right-4 max-lg:left-4 min-md:h-[85vh] min-md:min-w-md min-lg:sticky min-lg:top-0 min-lg:bottom-5 min-lg:h-[calc(100svh-3.5rem-2.75rem)] min-lg:w-[23vw]',

        className,
      )}
    >
      <div
        className={cn(
          'h-full w-full overflow-hidden transition-[opacity,transform] duration-300 ease-in-out',
          isVisible
            ? 'translate-x-0 translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-4 opacity-0 min-lg:translate-x-4 min-lg:translate-y-0',
        )}
      >
        {children}
      </div>
    </div>
  );
}
