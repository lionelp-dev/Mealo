import { Typography } from '@/app/components/Typography';
import type { ReactNode } from 'react';

type RecipeFormCardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export function RecipeFormCard({
  title,
  children,
  className = '',
}: RecipeFormCardProps) {
  return (
    <section
      className={`flex w-full max-w-full min-w-0 flex-col gap-4 rounded-2xl border border-base-300/30 bg-base-100 p-5 py-6 shadow-xs sm:p-7.25 sm:py-8 ${className}`}
    >
      {title && (
        <Typography
          as="h2"
          variant="body-xl"
          tone="secondary"
          className="-mt-1 truncate"
        >
          {title}
        </Typography>
      )}
      {children}
    </section>
  );
}
