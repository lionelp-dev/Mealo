import { AdminSidebar } from '@/app/components/admin-sidebar';
import { AppContent } from '@/app/components/app-content';
import { AppShell } from '@/app/components/app-shell';
import {
  AppSidebarHeader,
  type HeaderLeftContentProps,
} from '@/app/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren, type ReactNode } from 'react';

type AdminSidebarLayoutProps = PropsWithChildren<
  {
    breadcrumbs?: BreadcrumbItem[];
    headerRightContent?: ReactNode;
  } & HeaderLeftContentProps
>;

export default function AdminSidebarLayout({
  children,
  breadcrumbs = [],
  headerRightContent,
  ...headerLeftContentProps
}: AdminSidebarLayoutProps) {
  return (
    <AppShell variant="sidebar">
      <AdminSidebar />
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
