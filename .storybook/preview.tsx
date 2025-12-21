import type { Preview } from '@storybook/react-vite';
import { useEffect } from 'react';
import '../resources/css/app.css';
import i18n from '../resources/js/lib/i18n';

const preview: Preview = {
  initialGlobals: {
    locale: 'fr',
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
    locale: {
      description: 'Internationalization locale',
      toolbar: {
        title: 'Locale',
        icon: 'globe',
        items: [
          { value: 'en', title: 'English' },
          { value: 'fr', title: 'Français' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      test: 'todo',
    },
    layout: 'fullscreen',
  },

  decorators: [
    (Story, context) => {
      const { theme, locale } = context.globals;

      useEffect(() => {
        // Gestion du thème
        const currentTheme = theme || 'light';

        // Appliquer la classe dark
        document.documentElement.classList.toggle(
          'dark',
          currentTheme === 'dark',
        );

        // Appliquer data-theme pour DaisyUI
        const dataTheme = currentTheme === 'dark' ? 'business' : 'corporate';
        document.documentElement.setAttribute('data-theme', dataTheme);
      }, [theme]);

      useEffect(() => {
        // Gestion de la locale
        if (locale && locale !== '_reset' && ['en', 'fr'].includes(locale)) {
          i18n.changeLanguage(locale);
        }
      }, [locale]);

      return <Story />;
    },
  ],
};

export default preview;
