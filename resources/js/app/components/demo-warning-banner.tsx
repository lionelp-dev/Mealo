import { useClipboard } from '@/app/hooks/use-clipboard';
import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { Check, Copy, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export function DemoWarningBanner() {
  const { auth } = usePage<PageProps>().props;

  const [isDismissed, setIsDismissed] = useState(false);
  const [copiedText, copy] = useClipboard();

  // Check if banner was dismissed (reset on new session)
  useEffect(() => {
    const dismissed = sessionStorage.getItem('demo-warning-dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('demo-warning-dismissed', 'true');
  };

  // Don't show if not a demo user or if dismissed
  if (!auth.user?.is_demo || isDismissed || !auth.user.demo_expires_at) {
    return null;
  }

  const expirationDate = new Date(auth.user.demo_expires_at);
  const now = new Date();
  const daysRemaining = Math.ceil(
    (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Determine alert level based on days remaining
  const isUrgent = daysRemaining <= 7;
  const alertClass = isUrgent
    ? 'alert-error border-error/30 bg-error/10'
    : 'alert-warning border-warning/30 bg-warning/10';

  const reconnectUrl = auth.user.demo_token
    ? `${window.location.origin}/demo/session/${auth.user.demo_token}`
    : null;

  const isCopied = reconnectUrl !== null && copiedText === reconnectUrl;

  return (
    <div className={`alert ${alertClass} mb-4 flex flex-col gap-1 shadow-sm`}>
      <div className="flex w-full items-center justify-between">
        <span>Compte démo</span>
        <button
          onClick={handleDismiss}
          className="btn btn-square btn-ghost btn-sm"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <span className="flex flex-col pb-1.5 text-xs">
        {isUrgent && (
          <span className="font-semibold">
            '⚠️ Votre compte démo expire bientôt'
          </span>
        )}
        <span className="opacity-90">
          Il vous reste <strong>{daysRemaining} jour(s)</strong>. Ce compte sera
          supprimé le{' '}
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
      {reconnectUrl && (
        <button
          type="button"
          onClick={() => copy(reconnectUrl)}
          className="btn mt-1 w-full gap-2 py-3.5 btn-xs"
        >
          {isCopied ? (
            <span className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 pt-[2px]" />
              <span className="pr-4.5">Lien copié</span>
            </span>
          ) : (
            <span className="flex min-w-0 items-center gap-2">
              <Copy className="h-3.5 w-3.5 shrink-0" />
              <span className="min-w-0 truncate">
                Copier le lien de reconnexion
              </span>
            </span>
          )}
        </button>
      )}
    </div>
  );
}
