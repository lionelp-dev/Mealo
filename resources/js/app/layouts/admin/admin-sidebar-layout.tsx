import { AdminSidebar } from '@/app/components/admin-sidebar';
import { AppContent } from '@/app/components/app-content';
import { AppShell } from '@/app/components/app-shell';
import { AppSidebarHeader } from '@/app/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/app/entities/';
import { type PropsWithChildren, type ReactNode } from 'react';

export default function AdminSidebarLayout({
  children,
  breadcrumbs = [],
  headerLeftContent,
  headerRightContent,
}: PropsWithChildren<{
  breadcrumbs?: BreadcrumbItem[];
  headerLeftContent?: ReactNode;
  headerRightContent?: ReactNode;
}>) {
  return (
    <AppShell variant="sidebar">
      <AdminSidebar />
      <AppContent variant="sidebar">
        <AppSidebarHeader
          breadcrumbs={breadcrumbs}
          headerLeftContent={headerLeftContent}
          headerRightContent={headerRightContent}
        />
        {children}
      </AppContent>
    </AppShell>
  );
}
