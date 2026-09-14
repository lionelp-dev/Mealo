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
      className={`flex w-full max-w-full min-w-0 flex-col gap-4 rounded-2xl border border-base-300/30 bg-base-100 p-5 py-6 shadow-xs sm:p-7 sm:py-6.5 ${className}`}
    >
      {title && (
        <h2 className="-mt-1 truncate text-lg font-bold text-secondary">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
