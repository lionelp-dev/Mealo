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
      title: t('settings.twoFactor.pageTitle'),
      href: show.url(),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('settings.twoFactor.pageTitle')} />
      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall
            title={t('settings.twoFactor.sectionTitle')}
            description={t('settings.twoFactor.sectionDescription')}
          />
          {twoFactorEnabled ? (
            <div className="flex flex-col items-start justify-start space-y-4">
              <Badge variant="default">{t('settings.twoFactor.enabled')}</Badge>
              <p className="text-muted-foreground">
                {t('settings.twoFactor.enabledDescription')}
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
                      <ShieldBan /> {t('settings.twoFactor.disableButton')}
                    </button>
                  )}
                </Form>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-start justify-start space-y-4">
              <Badge variant="destructive">{t('settings.twoFactor.disabled')}</Badge>
              <p className="text-muted-foreground">
                {t('settings.twoFactor.disabledDescription')}
              </p>

              <div>
                {hasSetupData ? (
                  <button className="btn btn-primary" onClick={() => setShowSetupModal(true)}>
                    <ShieldCheck />
                    {t('settings.twoFactor.continueSetup')}
                  </button>
                ) : (
                  <Form
                    {...enable.form()}
                    onSuccess={() => setShowSetupModal(true)}
                  >
                    {({ processing }) => (
                      <button className="btn btn-primary" type="submit" disabled={processing}>
                        <ShieldCheck />
                        {t('settings.twoFactor.enableButton')}
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
