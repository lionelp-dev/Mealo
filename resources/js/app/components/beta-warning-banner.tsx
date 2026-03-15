import { PageProps } from '@/app/entities/';
import { usePage } from '@inertiajs/react';
import { AlertCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export function BetaWarningBanner() {
  const { auth } = usePage<PageProps>().props;

  const [isDismissed, setIsDismissed] = useState(false);

  // Check if banner was dismissed (reset on new session)
  useEffect(() => {
    const dismissed = sessionStorage.getItem('beta-warning-dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('beta-warning-dismissed', 'true');
  };

  // Don't show if not a beta user or if dismissed
  if (!auth.user?.is_beta_user || isDismissed || !auth.user.beta_expires_at) {
    return null;
  }

  const expirationDate = new Date(auth.user.beta_expires_at);
  const now = new Date();
  const daysRemaining = Math.ceil(
    (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Determine alert level based on days remaining
  const isUrgent = daysRemaining <= 7;
  const alertClass = isUrgent
    ? 'alert-error border-error/30 bg-error/10'
    : 'alert-warning border-warning/30 bg-warning/10';

  return (
    <div className={`alert ${alertClass} mb-4 flex flex-col gap-1 shadow-sm`}>
      <div className="flex w-full items-center justify-between">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <button
          onClick={handleDismiss}
          className="btn btn-square btn-ghost btn-sm"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <span className="flex flex-col text-xs">
        <span className="font-semibold">
          {isUrgent
            ? '⚠️ Votre compte beta expire bientôt'
            : 'Compte Beta Temporaire'}
        </span>
        <span className="opacity-90">
          Il vous reste <strong>{daysRemaining} jour(s)</strong>. Vos données
          seront supprimées le{' '}
          <strong>
            {expirationDate.toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </strong>
          .
        </span>
      </span>
    </div>
  );
}
