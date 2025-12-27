import { cn } from '@/lib/utils';
import { ClassValue } from 'clsx';
import { type PropsWithChildren } from 'react';

type Props = { className?: ClassValue } & PropsWithChildren;

export function AppMainContent({ children, className }: Props) {
  return (
    <div className={'flex flex-col overflow-y-auto py-11'}>
      <div className={cn('mx-auto w-[90%]', className)}>{children}</div>
    </div>
  );
}
