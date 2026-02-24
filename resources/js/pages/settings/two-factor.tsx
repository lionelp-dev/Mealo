import HeadingSmall from '@/components/heading-small';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Badge } from '@/components/ui/badge';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { disable, enable, show } from '@/routes/two-factor';
import { type BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';
import { ShieldBan, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface TwoFactorProps {
  requiresConfirmation?: boolean;
  twoFactorEnabled?: boolean;
}

// Breadcrumbs will be translated in component

export default function TwoFactor({
  requiresConfirmation = false,
  twoFactorEnabled = false,
}: TwoFactorProps) {
  const { t } = useTranslation();
  const {
    qrCodeSvg,
    hasSetupData,
    manualSetupKey,
    clearSetupData,
    fetchSetupData,
    recoveryCodesList,
    fetchRecoveryCodes,
    errors,
  } = useTwoFactorAuth();
  const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('settings.twoFactor.pageTitle', 'Two-Factor Authentication'),
      href: show.url(),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head
        title={t('settings.twoFactor.pageTitle', 'Two-Factor Authentication')}
      />
      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall
            title={t(
              'settings.twoFactor.sectionTitle',
              'Two-Factor Authentication',
            )}
            description={t(
              'settings.twoFactor.sectionDescription',
              'Manage your two-factor authentication settings',
            )}
          />
          {twoFactorEnabled ? (
            <div className="flex flex-col items-start justify-start space-y-4">
              <Badge variant="default">
                {t('settings.twoFactor.enabled', 'Enabled')}
              </Badge>
              <p className="text-muted-foreground">
                {t(
                  'settings.twoFactor.enabledDescription',
                  'With two-factor authentication enabled, you will be prompted for a secure, random pin during login, which you can retrieve from the TOTP-supported application on your phone.',
                )}
              </p>

              <TwoFactorRecoveryCodes
                recoveryCodesList={recoveryCodesList}
                fetchRecoveryCodes={fetchRecoveryCodes}
                errors={errors}
              />

              <div className="relative inline">
                <Form {...disable.form()}>
                  {({ processing }) => (
                    <button
                      className="btn btn-error"
                      type="submit"
                      disabled={processing}
                    >
                      <ShieldBan />{' '}
                      {t('settings.twoFactor.disableButton', 'Disable 2FA')}
                    </button>
                  )}
                </Form>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-start justify-start space-y-4">
              <Badge variant="destructive">
                {t('settings.twoFactor.disabled', 'Disabled')}
              </Badge>
              <p className="text-muted-foreground">
                {t(
                  'settings.twoFactor.disabledDescription',
                  'When you enable two-factor authentication, you will be prompted for a secure pin during login. This pin can be retrieved from a TOTP-supported application on your phone.',
                )}
              </p>

              <div>
                {hasSetupData ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowSetupModal(true)}
                  >
                    <ShieldCheck />
                    {t('settings.twoFactor.continueSetup', 'Continue Setup')}
                  </button>
                ) : (
                  <Form
                    {...enable.form()}
                    onSuccess={() => setShowSetupModal(true)}
                  >
                    {({ processing }) => (
                      <button
                        className="btn btn-primary"
                        type="submit"
                        disabled={processing}
                      >
                        <ShieldCheck />
                        {t('settings.twoFactor.enableButton', 'Enable 2FA')}
                      </button>
                    )}
                  </Form>
                )}
              </div>
            </div>
          )}

          <TwoFactorSetupModal
            isOpen={showSetupModal}
            onClose={() => setShowSetupModal(false)}
            requiresConfirmation={requiresConfirmation}
            twoFactorEnabled={twoFactorEnabled}
            qrCodeSvg={qrCodeSvg}
            manualSetupKey={manualSetupKey}
            clearSetupData={clearSetupData}
            fetchSetupData={fetchSetupData}
            errors={errors}
          />
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
