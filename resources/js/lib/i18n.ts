import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { Settings } from 'luxon';
import { initReactI18next } from 'react-i18next';

// Import translation files directly
import translationEN from '../locales/en/translation.json';
import translationFR from '../locales/fr/translation.json';

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
    debug: process.env.NODE_ENV === 'development',

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

// Configure Luxon locale to match i18next language
const updateLuxonLocale = (language: string) => {
  // Map i18next language codes to Luxon locale codes
  const luxonLocale = language === 'fr' ? 'fr' : 'en';
  Settings.defaultLocale = luxonLocale;
};

// Set initial Luxon locale
updateLuxonLocale(i18n.language);

// Listen for language changes and update Luxon locale
i18n.on('languageChanged', updateLuxonLocale);

export default i18n;
