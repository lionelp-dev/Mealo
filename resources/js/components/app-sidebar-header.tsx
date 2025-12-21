import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { type ReactNode } from 'react';

export function AppSidebarHeader({
  breadcrumbs = [],
  headerLeftContent,
  headerRightContent,
}: {
  breadcrumbs?: BreadcrumbItemType[];
  children?: ReactNode;
  headerLeftContent?: ReactNode;
  headerRightContent?: ReactNode;
}) {
  return (
    <header className="sticky flex h-16 min-h-0 w-full shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
      <SidebarTrigger className="-ml-1" />
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="ml-1 flex flex-1">{headerLeftContent}</div>
      <div className="mr-3 flex flex-1 justify-end">{headerRightContent}</div>
    </header>
  );
}
