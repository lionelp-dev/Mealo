import { Breadcrumbs } from '@/app/components/breadcrumbs';
import { SidebarTrigger } from '@/app/components/ui/sidebar';
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
    <header className="sticky z-20 mx-auto flex h-16 w-[96.5%] shrink-0 items-center gap-10 border-b border-sidebar-border/50 pb-[2px] transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <SidebarTrigger />
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="flex flex-1">{headerLeftContent}</div>
      <div className="flex flex-1 justify-end">{headerRightContent}</div>
    </header>
  );
}
