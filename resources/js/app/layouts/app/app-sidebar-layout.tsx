import { AppContent } from '@/app/components/app-content';
import { AppShell } from '@/app/components/app-shell';
import { AppSidebar } from '@/app/components/app-sidebar';
import {
  AppSidebarHeader,
  type HeaderLeftContentProps,
} from '@/app/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren, type ReactNode } from 'react';

type AppSidebarLayoutProps = PropsWithChildren<
  {
    breadcrumbs?: BreadcrumbItem[];
    headerRightContent?: ReactNode;
  } & HeaderLeftContentProps
>;

export default function AppSidebarLayout({
  children,
  breadcrumbs = [],
  headerRightContent,
  ...headerLeftContentProps
}: AppSidebarLayoutProps) {
  return (
    <AppShell variant="sidebar">
      <AppSidebar />
      <AppContent variant="sidebar">
        <AppSidebarHeader
          breadcrumbs={breadcrumbs}
          headerRightContent={headerRightContent}
          {...headerLeftContentProps}
        />
        {children}
      </AppContent>
    </AppShell>
  );
}
