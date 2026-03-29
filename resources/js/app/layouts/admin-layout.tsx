import Toast from '@/app/components/ui/toast';
import { FlashMessage, type BreadcrumbItem } from '@/types';
import AdminSidebarLayout from '@/app/layouts/admin/admin-sidebar-layout';
import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface AdminLayoutProps {
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
}: AdminLayoutProps) => {
  const { flash } = usePage<{ flash: FlashMessage }>().props;
  return (
    <AdminSidebarLayout
      breadcrumbs={breadcrumbs}
      headerLeftContent={headerLeftContent}
      headerRightContent={headerRightContent}
      {...props}
    >
      {children}
      <Toast.Portal>
        <Toast flash={flash} />
      </Toast.Portal>
    </AdminSidebarLayout>
  );
};
