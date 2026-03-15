import { AppContent } from '@/app/components/app-content';
import { AppHeader } from '@/app/components/app-header';
import { AppShell } from '@/app/components/app-shell';
import { type BreadcrumbItem } from '@/app/entities/';
import type { PropsWithChildren } from 'react';

export default function AppHeaderLayout({
  children,
  breadcrumbs,
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
  return (
    <AppShell>
      <AppHeader breadcrumbs={breadcrumbs} />
      <AppContent>{children}</AppContent>
    </AppShell>
  );
}
