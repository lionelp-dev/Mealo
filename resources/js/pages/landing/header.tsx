import AppLogoIcon from '@/app/components/app-logo-icon';
import { LanguageSwitcher } from '@/app/components/language-switcher';
import { login } from '@/routes';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export function Header() {
  const { t } = useTranslation();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-base-300/50 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo + Nav Links */}
        <div className="flex items-center gap-8">
          <AppLogoIcon
            alt={t('landing.header.appName')}
            className="size-8 object-contain"
          />

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#about"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t('landing.header.about')}
            </a>
            <a
              href="#features"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t('landing.header.features')}
            </a>
            <a
              href="#preview"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t('landing.header.preview')}
            </a>
          </nav>
        </div>

        {/* CTA */}
        <div className="flex gap-3">
          <LanguageSwitcher className="rounded-full btn-sm btn-secondary" />
          <button
            className="btn rounded-full px-6 btn-outline btn-sm btn-secondary"
            onClick={() => router.get(login.url())}
          >
            {t('landing.header.signIn')}
          </button>
        </div>
      </div>
    </header>
  );
}
