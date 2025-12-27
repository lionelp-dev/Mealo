import { cn } from '@/lib/utils';
import { ClassValue } from 'clsx';
import { type PropsWithChildren } from 'react';

type Props = { className?: ClassValue } & PropsWithChildren;

export function AppMainContent({ children, className }: Props) {
  return (
    <div className={cn('flex flex-col overflow-y-auto py-11', className)}>
      <div className="mx-auto w-[90%]">{children}</div>
    </div>
  );
}
