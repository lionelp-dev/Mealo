import { AdminDashboardInertiaAdapter } from '@/features/admin/dashboard/infrastructure/inertia.adapter';
import AdminDashboard from '@/features/admin/dashboard/ui/admin-dashboard';

export default function Dashboard() {
  return (
    <AdminDashboardInertiaAdapter>
      <AdminDashboard />
    </AdminDashboardInertiaAdapter>
  );
}
