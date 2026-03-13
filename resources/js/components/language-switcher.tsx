import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { router } from '@inertiajs/react';
import { ChevronDown, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: 'fr' | 'en') => {
    // Mettre à jour i18next (frontend)
    i18n.changeLanguage(lng);

    // Synchroniser avec le backend
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
  };

  const getCurrentLanguageLabel = () => {
    return i18n.language === 'fr' ? 'Français' : 'English';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="btn gap-3 pl-4 btn-outline">
          <ChevronDown className="h-4 w-4" />
          <span className="hidden sm:inline">{getCurrentLanguageLabel()}</span>
          <span className="sm:hidden">{i18n.language.toUpperCase()}</span>
          <Languages className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => changeLanguage('fr')}
          disabled={i18n.language === 'fr'}
          className="gap-2"
        >
          🇫🇷 Français
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeLanguage('en')}
          disabled={i18n.language === 'en'}
          className="gap-2"
        >
          🇬🇧 English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
