import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import { LanguageSwitcher } from '@/components/language-switcher';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import languageRoute from '@/routes/language';
import { useTranslation } from 'react-i18next';

// Breadcrumbs will be translated in the component

export default function Language() {
  const { t } = useTranslation();

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('settings.language.pageTitle', 'Language settings'),
      href: languageRoute.edit.url(),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('settings.language.pageTitle', 'Language settings')} />

      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall
            title={t('settings.language.sectionTitle', 'Language settings')}
            description={t(
              'settings.language.sectionDescription',
              'Update your language setting',
            )}
          />
          <LanguageSwitcher />
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
