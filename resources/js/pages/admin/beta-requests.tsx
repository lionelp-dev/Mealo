import { BetaRequestInertiaAdapter } from '@/app/features/admin/beta-requests/infrastructure/inertia.adapter';
import BetaRequestsPage from '@/app/features/admin/beta-requests/ui/beta-requests.page';

export default function BetaRequests() {
  return (
    <BetaRequestInertiaAdapter>
      <BetaRequestsPage />
    </BetaRequestInertiaAdapter>
  );
}
