// Import translation files directly
import translationEN from '../locales/en/translation.json';
import translationFR from '../locales/fr/translation.json';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: translationEN,
  },
  fr: {
    translation: translationFR,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: 'fr', // Default to French
    debug: false,

    interpolation: {
      escapeValue: false, // React already escapes by default
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    react: {
      useSuspense: false, // Disable suspense to avoid hydration issues with SSR
    },
  });

// Synchroniser la locale avec les données utilisateur d'Inertia
document.addEventListener('inertia:success', (event: Event) => {
  const customEvent = event as CustomEvent<{
    page: { props?: { auth?: { user?: { locale?: string } } } };
  }>;
  const userLocale = customEvent.detail.page.props?.auth?.user?.locale;
  if (userLocale && i18n.language !== userLocale) {
    i18n.changeLanguage(userLocale);
  }
});

export default i18n;
