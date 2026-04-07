import HeadingSmall from '@/app/components/heading-small';
import { LanguageSwitcher } from '@/app/components/language-switcher';
import AppLayout from '@/app/layouts/app-layout';
import SettingsLayout from '@/app/layouts/settings/layout';
import languageRoute from '@/routes/language';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
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
