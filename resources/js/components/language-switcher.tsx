import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { ChevronDown, Languages } from 'lucide-react';
import { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher({ className }: ComponentProps<'button'>) {
  const { i18n } = useTranslation();
  const { auth } = usePage<SharedData>().props;

  const changeLanguage = (lng: 'fr' | 'en') => {
    // Mettre à jour i18next (frontend)
    i18n.changeLanguage(lng);
    // Synchroniser avec le backend seulement si l'utilisateur est connecté
    if (auth.user) {
      router.put(
        '/settings/locale',
        { locale: lng },
        {
          preserveState: true,
          preserveScroll: true,
          onError: (errors) => {
            console.error('Failed to update locale:', errors);
          },
        },
      );
    }
  };

  const getCurrentLanguageLabel = () => {
    return i18n.language === 'fr' ? 'Français' : 'English';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            'group btn gap-2.5 border-base-300 pl-4 btn-outline',
            className,
          )}
        >
          <ChevronDown className="-mr-1 h-4 w-4 transform pt-[1px] duration-75 ease-in first:group-aria-expanded:-scale-y-100" />
          <span className="hidden sm:inline">{getCurrentLanguageLabel()}</span>
          <span className="sm:hidden">{i18n.language.toUpperCase()}</span>
          <Languages className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem
          onClick={() => changeLanguage('fr')}
          disabled={i18n.language === 'fr'}
          className="gap-2"
        >
          Français
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeLanguage('en')}
          disabled={i18n.language === 'en'}
          className="gap-2"
        >
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
