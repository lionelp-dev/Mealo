import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: 'fr' | 'en') => {
    i18n.changeLanguage(lng);
  };

  const getCurrentLanguageLabel = () => {
    return i18n.language === 'fr' ? 'Français' : 'English';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="btn gap-3 pl-5 text-secondary btn-link">
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
