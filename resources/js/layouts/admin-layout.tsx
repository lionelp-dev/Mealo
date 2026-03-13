import Toast from '@/components/ui/toast';
import AdminSidebarLayout from '@/layouts/admin/admin-sidebar-layout';
import { FlashMessage, type BreadcrumbItem } from '@/types';
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
