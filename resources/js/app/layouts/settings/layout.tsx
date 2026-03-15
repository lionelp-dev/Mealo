import Heading from '@/app/components/heading';
import { Separator } from '@/app/components/ui/separator';
import { type NavItem } from '@/app/entities/';
import { cn } from '@/app/lib/';
import { edit as editAppearance } from '@/routes/appearance';
import language from '@/routes/language';
import { edit as editPassword } from '@/routes/password';
import { edit } from '@/routes/profile';
import { show } from '@/routes/two-factor';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

export default function SettingsLayout({ children }: PropsWithChildren) {
  const { t } = useTranslation();

  // When server-side rendering, we only render the layout on the client...
  if (typeof window === 'undefined') {
    return null;
  }

  const currentPath = window.location.pathname;

  const sidebarNavItems: NavItem[] = [
    {
      title: t('settings.profile.title', 'Profile'),
      href: edit(),
      icon: null,
    },
    {
      title: t('settings.password.title', 'Password'),
      href: editPassword(),
      icon: null,
    },
    {
      title: t('settings.twoFactor.title', 'Two-Factor Auth'),
      href: show(),
      icon: null,
    },
    {
      title: t('settings.appearance.title', 'Appearance'),
      href: editAppearance(),
      icon: null,
    },
    {
      title: t('settings.appearance.language', 'Language'),
      href: language.edit.url(),
      icon: null,
    },
  ];

  return (
    <div className="px-8 py-6">
      <Heading
        title={t('settings.title', 'Settings')}
        description={t(
          'settings.description',
          'Manage your profile and account settings',
        )}
      />

      <div className="flex flex-col lg:flex-row lg:space-x-12">
        <aside className="w-full max-w-xl lg:w-60">
          <nav className="flex flex-col space-y-1 space-x-0">
            {sidebarNavItems.map((item, index) => (
              <Link
                key={`${typeof item.href === 'string' ? item.href : item.href.url}-${index}`}
                href={item.href}
                className={cn('btn w-full justify-start btn-ghost btn-sm', {
                  'bg-muted':
                    currentPath ===
                    (typeof item.href === 'string' ? item.href : item.href.url),
                })}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.title}
              </Link>
            ))}
          </nav>
        </aside>

        <Separator className="my-6 lg:hidden" />

        <div className="flex-1 md:max-w-2xl">
          <section className="max-w-xl space-y-12">{children}</section>
        </div>
      </div>
    </div>
  );
}
