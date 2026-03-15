import AppearanceTabs from '@/app/components/appearance-tabs';
import HeadingSmall from '@/app/components/heading-small';
import { type BreadcrumbItem } from '@/app/entities/';
import AppLayout from '@/app/layouts/app-layout';
import SettingsLayout from '@/app/layouts/settings/layout';
import { edit as editAppearance } from '@/routes/appearance';
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
          <HeadingSmall
            title={t('settings.appearance.sectionTitle', 'Appearance settings')}
            description={t(
              'settings.appearance.sectionDescription',
              "Update your account's appearance settings",
            )}
          />
          <AppearanceTabs />
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
