import { AdminDashboardInertiaAdapter } from '@/app/features/admin/dashboard/infrastructure/inertia.adapter';
import AdminDashboard from '@/app/features/admin/dashboard/ui/admin-dashboard';

export default function Dashboard() {
  return (
    <AdminDashboardInertiaAdapter>
      <AdminDashboard />
    </AdminDashboardInertiaAdapter>
  );
}
