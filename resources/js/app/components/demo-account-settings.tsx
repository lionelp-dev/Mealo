import HeadingSmall from '@/app/components/heading-small';
import { useClipboard } from '@/app/hooks/use-clipboard';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Check, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function DemoAccountSettings() {
  const { t } = useTranslation();
  const { auth } = usePage<SharedData>().props;
  const [copiedText, copy] = useClipboard();

  if (!auth.user?.is_demo || !auth.user.demo_expires_at) {
    return null;
  }

  const expirationDate = new Date(auth.user.demo_expires_at);
  const now = new Date();
  const daysRemaining = Math.ceil(
    (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  const formattedDate = expirationDate.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const reconnectUrl = auth.user.demo_token
    ? `${window.location.origin}/demo/session/${auth.user.demo_token}`
    : null;

  const isCopied = reconnectUrl !== null && copiedText === reconnectUrl;

  return (
    <div className="flex flex-col gap-4">
      <HeadingSmall
        title={t('settings.demoAccount.title', 'Demo account')}
        description={t(
          'settings.demoAccount.sectionDescription',
          'Keep your reconnect link to come back to this demo account later.',
        )}
      />

      <p className="text-sm text-muted-foreground">
        {t('settings.demoAccount.expiryLine', {
          days: daysRemaining,
          date: formattedDate,
          defaultValue:
            'This account expires in {{days}} day(s) and will be deleted on {{date}}.',
        })}
      </p>

      {reconnectUrl && (
        <div className="grid gap-4">
          <code className="truncate rounded-md bg-base-200 px-3 py-2 text-xs">
            {reconnectUrl}
          </code>
          <button
            type="button"
            onClick={() => copy(reconnectUrl)}
            className="btn w-fit gap-2 border-gray-300 btn-outline btn-sm"
          >
            {isCopied ? (
              <>
                <Check className="h-4 w-4" />
                {t('settings.demoAccount.linkCopied', 'Link copied')}
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                {t('settings.demoAccount.copyLink', 'Copy reconnect link')}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
