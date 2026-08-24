import { Breadcrumbs } from '@/app/components/breadcrumbs';
import { SidebarTrigger } from '@/app/components/ui/sidebar';
import { cn } from '@/app/lib';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { ClassValue } from 'clsx';
import { type ReactNode } from 'react';

export type HeaderSlots = {
  mobileSidebarTrigger: ReactNode;
};

export type RenderHeaderLeftContent = (slots: HeaderSlots) => ReactNode;

export type HeaderLeftContentProps =
  | {
      headerLeftContent?: ReactNode;
      renderHeaderLeftContent?: never;
    }
  | {
      headerLeftContent?: never;
      renderHeaderLeftContent: RenderHeaderLeftContent;
    };

type AppSidebarHeaderProps = {
  breadcrumbs?: BreadcrumbItemType[];
  children?: ReactNode;
  headerRightContent?: ReactNode;
} & HeaderLeftContentProps;

function AppSidebarTrigger({ className }: { className?: ClassValue }) {
  return (
    <SidebarTrigger
      className={cn(
        "relative shrink-0 after:pointer-events-none after:absolute after:inset-y-1 after:-right-[9.5px] after:w-px after:bg-base-300 after:content-['']",
        className,
      )}
    />
  );
}

export function AppSidebarHeader({
  breadcrumbs = [],
  headerLeftContent,
  renderHeaderLeftContent,
  headerRightContent,
}: AppSidebarHeaderProps) {
  const mobileSidebarTrigger = <AppSidebarTrigger className="min-lg:hidden" />;

  const leftContent = renderHeaderLeftContent
    ? renderHeaderLeftContent({ mobileSidebarTrigger })
    : headerLeftContent;
  const usesCustomMobileTriggerPlacement = Boolean(renderHeaderLeftContent);

  return (
    <header className="sticky z-20 flex h-fit shrink-0 items-center gap-3 border-b border-sidebar-border/50 px-5 py-3 transition-[width,height] ease-linear min-lg:gap-6">
      {!usesCustomMobileTriggerPlacement && mobileSidebarTrigger}
      <AppSidebarTrigger className="max-lg:hidden" />
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="flex h-full min-w-0 flex-1">{leftContent}</div>
      <div className="flex max-w-fit flex-1 justify-end">
        {headerRightContent}
      </div>
    </header>
  );
}
