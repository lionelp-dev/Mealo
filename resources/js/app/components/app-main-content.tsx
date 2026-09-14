import { PageContainer } from '@/app/components/page-container';
import { ClassValue } from 'clsx';
import { type PropsWithChildren } from 'react';

type Props = { className?: ClassValue } & PropsWithChildren;

export function AppMainContent({ children, className }: Props) {
  return <PageContainer contentClassName={className}>{children}</PageContainer>;
}
