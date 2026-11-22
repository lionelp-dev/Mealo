import { Typography } from '@/app/components/Typography';
import AppearanceTabs from '@/app/components/appearance-tabs';
import AppLayout from '@/app/layouts/app-layout';
import SettingsLayout from '@/app/layouts/settings/layout';
import { edit as editAppearance } from '@/routes/appearance';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

// Breadcrumbs will be translated in the component

export default function Appearance() {
  const { t } = useTranslation();

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('settings.appearance.pageTitle', 'Appearance settings'),
      href: editAppearance().url,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('settings.appearance.pageTitle', 'Appearance settings')} />

      <SettingsLayout>
        <div className="space-y-6">
          <header>
            <Typography as="h3" variant="title" weight="medium">
              {t('settings.appearance.sectionTitle', 'Appearance settings')}
            </Typography>
            <Typography variant="body-sm" tone="muted">
              {t(
                'settings.appearance.sectionDescription',
                "Update your account's appearance settings",
              )}
            </Typography>
          </header>
          <AppearanceTabs />
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
