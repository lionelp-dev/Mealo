import Toast from '@/app/components/ui/toast';
import { FlashMessage, type BreadcrumbItem } from '@/types';
import AppLayoutTemplate from '@/app/layouts/app/app-sidebar-layout';
import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  headerLeftContent?: ReactNode;
  headerRightContent?: ReactNode;
}

export default ({
  children,
  breadcrumbs,
  headerLeftContent,
  headerRightContent,
  ...props
}: AppLayoutProps) => {
  const { flash } = usePage<{ flash: FlashMessage }>().props;
  return (
    <AppLayoutTemplate
      breadcrumbs={breadcrumbs}
      headerLeftContent={headerLeftContent}
      headerRightContent={headerRightContent}
      {...props}
    >
      {children}
      <Toast.Portal>
        <Toast flash={flash} />
      </Toast.Portal>
    </AppLayoutTemplate>
  );
};
