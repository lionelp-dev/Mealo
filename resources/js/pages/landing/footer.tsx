import { Github, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-base-300/60 bg-card py-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-0 px-6">
        <div className="flex flex-col items-center justify-between md:flex-row">
          {/* Logo & Description */}
          <div className="flex flex-col items-center gap-3 md:items-start">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                <span className="text-sm font-semibold text-primary-foreground">
                  M
                </span>
              </div>
              <span className="font-semibold text-secondary">
                {t('landing.footer.appName')}
              </span>
            </div>
            <p className="max-w-xs text-center text-sm text-muted-foreground md:text-left">
              {t('landing.footer.description')}
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t('landing.footer.about')}
            </a>
            <a
              href="#"
              className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Mail className="h-4 w-4" />
              {t('landing.footer.contact')}
            </a>
            <a
              href="#"
              className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Github className="h-4 w-4" />
              {t('landing.footer.github')}
            </a>
          </div>
        </div>
        <div className="divider-neutral/20 divider" />
        {/* Copyright */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            {t('landing.footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
