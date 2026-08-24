import { type HeaderLeftContentProps } from '@/app/components/app-sidebar-header';
import Toast from '@/app/components/ui/toast';
import AdminSidebarLayout from '@/app/layouts/admin/admin-sidebar-layout';
import { FlashMessage, type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';

type AdminLayoutProps = {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  headerRightContent?: ReactNode;
} & HeaderLeftContentProps;

export default ({
  children,
  breadcrumbs,
  headerRightContent,
  ...headerLeftContentProps
}: AdminLayoutProps) => {
  const { flash } = usePage<{ flash: FlashMessage }>().props;
  return (
    <AdminSidebarLayout
      breadcrumbs={breadcrumbs}
      headerRightContent={headerRightContent}
      {...headerLeftContentProps}
    >
      {children}
      <Toast.Portal>
        <Toast flash={flash} />
      </Toast.Portal>
    </AdminSidebarLayout>
  );
};
