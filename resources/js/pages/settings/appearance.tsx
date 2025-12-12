import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editAppearance } from '@/routes/appearance';
import { useTranslation } from 'react-i18next';

// Breadcrumbs will be translated in the component

export default function Appearance() {
  const { t } = useTranslation();
  
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('settings.appearance.pageTitle'),
      href: editAppearance().url,
    },
  ];
  
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('settings.appearance.pageTitle')} />

      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall
            title={t('settings.appearance.sectionTitle')}
            description={t('settings.appearance.sectionDescription')}
          />
          <AppearanceTabs />
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
