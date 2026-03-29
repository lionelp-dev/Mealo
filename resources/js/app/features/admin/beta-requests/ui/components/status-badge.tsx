import { BetaRequest } from '@/types';
import { Clock, Mail, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export function StatusBadge({ status }: { status: BetaRequest['status'] }) {
  const badges = {
    pending: (
      <span className="badge gap-1 badge-warning">
        <Clock className="h-3 w-3" />
        En attente
      </span>
    ),
    approved: (
      <span className="badge gap-1 badge-info">
        <Mail className="h-3 w-3" />
        Approuvé
      </span>
    ),
    converted: (
      <span className="badge gap-1 badge-success">
        <CheckCircle className="h-3 w-3" />
        Converti
      </span>
    ),
    rejected: (
      <span className="badge gap-1 badge-error">
        <XCircle className="h-3 w-3" />
        Rejeté
      </span>
    ),
    expired: (
      <span className="badge gap-1 badge-ghost">
        <AlertCircle className="h-3 w-3" />
        Expiré
      </span>
    ),
  };
  return badges[status];
}
