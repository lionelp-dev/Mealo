import { Typography } from '@/app/components/Typography';
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
        <Typography as="span" variant="body-sm" tone="inherit">
          Compte démo
        </Typography>
        <button
          onClick={handleDismiss}
          className="btn btn-square btn-ghost btn-sm"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <Typography as="span" variant="caption" className="flex flex-col pb-1.5">
        {isUrgent && (
          <Typography
            as="span"
            variant="body-sm"
            tone="inherit"
            weight="semibold"
          >
            '⚠️ Votre compte démo expire bientôt'
          </Typography>
        )}
        <Typography
          as="span"
          variant="body-sm"
          tone="inherit"
          className="opacity-90"
        >
          Il vous reste{' '}
          <Typography as="strong" variant="body" weight="bold">
            {daysRemaining} jour(s)
          </Typography>
          . Ce compte sera supprimé le{' '}
          <Typography as="strong" variant="body" weight="bold">
            {expirationDate.toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Typography>
          .
        </Typography>
      </Typography>
      {reconnectUrl && (
        <button
          type="button"
          onClick={() => copy(reconnectUrl)}
          className="btn mt-1 w-full gap-2 py-3.5 btn-xs"
        >
          {isCopied ? (
            <span className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 pt-[2px]" />
              <Typography
                as="span"
                variant="body-sm"
                tone="inherit"
                className="pr-4.5"
              >
                Lien copié
              </Typography>
            </span>
          ) : (
            <span className="flex min-w-0 items-center gap-2">
              <Copy className="h-3.5 w-3.5 shrink-0" />
              <Typography
                as="span"
                variant="body-sm"
                tone="inherit"
                className="min-w-0 truncate"
              >
                Copier le lien de reconnexion
              </Typography>
            </span>
          )}
        </button>
      )}
    </div>
  );
}
