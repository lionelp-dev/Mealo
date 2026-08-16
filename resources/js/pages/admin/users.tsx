import { AdminUsersInertiaAdapter } from '@/app/features/admin/users/infrastructure/inertia.adapter';
import AdminUsersView from '@/app/features/admin/users/ui/users.view';

export default function Users() {
  return (
    <AdminUsersInertiaAdapter>
      <AdminUsersView />
    </AdminUsersInertiaAdapter>
  );
}
