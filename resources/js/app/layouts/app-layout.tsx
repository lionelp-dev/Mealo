import { type HeaderLeftContentProps } from '@/app/components/app-sidebar-header';
import Toast from '@/app/components/ui/toast';
import AppLayoutTemplate from '@/app/layouts/app/app-sidebar-layout';
import { FlashMessage, type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';

type AppLayoutProps = {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  headerRightContent?: ReactNode;
} & HeaderLeftContentProps;

export default ({
  children,
  breadcrumbs,
  headerRightContent,
  ...headerLeftContentProps
}: AppLayoutProps) => {
  const { flash } = usePage<{ flash: FlashMessage }>().props;
  return (
    <AppLayoutTemplate
      breadcrumbs={breadcrumbs}
      headerRightContent={headerRightContent}
      {...headerLeftContentProps}
    >
      {children}
      <Toast.Portal>
        <Toast flash={flash} />
      </Toast.Portal>
    </AppLayoutTemplate>
  );
};
