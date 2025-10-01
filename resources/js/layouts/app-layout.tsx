import Toast from '@/components/ui/toast';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { FlashMessage, type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  headerRightContent?: ReactNode;
}

export default ({
  children,
  breadcrumbs,
  headerRightContent,
  ...props
}: AppLayoutProps) => {
  const { flash } = usePage<{ flash: FlashMessage }>().props;
  return (
    <AppLayoutTemplate
      breadcrumbs={breadcrumbs}
      headerRightContent={headerRightContent}
      {...props}
    >
      {children}
      <Toast flash={flash} />
    </AppLayoutTemplate>
  );
};
