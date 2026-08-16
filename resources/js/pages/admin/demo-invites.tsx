import { AdminDemoInvitesInertiaAdapter } from '@/app/features/admin/demo-invites/infrastructure/inertia.adapter';
import AdminDemoInvitesView from '@/app/features/admin/demo-invites/ui/demo-invites.view';

export default function DemoInvites() {
  return (
    <AdminDemoInvitesInertiaAdapter>
      <AdminDemoInvitesView />
    </AdminDemoInvitesInertiaAdapter>
  );
}
