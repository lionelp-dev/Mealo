import { cn } from '@/app/lib/';
import { ClassValue } from 'clsx';
import { type PropsWithChildren } from 'react';

type Props = { className?: ClassValue } & PropsWithChildren;

export function AppMainContent({ children, className }: Props) {
  return (
    <div className={'flex flex-col overflow-y-auto py-6'}>
      <div className={cn('px-8', className)}>{children}</div>
    </div>
  );
}
