import { LanguageSwitcher } from '@/app/components/language-switcher';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
  name?: string;
  title?: string;
  description?: string;
}

export default function AuthSimpleLayout({
  children,
  title,
  description,
}: PropsWithChildren<AuthLayoutProps>) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      {/* Language switcher */}
      <div className="absolute top-8 right-10">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center gap-4">
            <Link
              href={home()}
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="mb-1 flex items-center justify-center rounded-md">
                <span className="flex h-fit w-fit origin-top flex-col overflow-hidden text-left font-logo text-[40px] leading-tight font-semibold text-secondary group-data-[state=collapsed]:scale-y-0 group-data-[state=collapsed]:opacity-0 [&_span]:-my-[6px]">
                  <span className="text-[52px]">Mealo</span>
                  <span>Planner</span>
                </span>
              </div>
              <span className="sr-only">{title}</span>
            </Link>

            <div className="space-y-2 text-center">
              <h1 className="text-xl font-medium">{title}</h1>
              <p className="text-center text-sm text-muted-foreground">
                {description}
              </p>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
