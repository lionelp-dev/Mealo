import '../css/app.css';
import { initializeTheme } from './app/hooks/use-appearance';
import './app/lib/i18n';
import { createInertiaApp } from '@inertiajs/react';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
  title: (title) => (title ? `${title} - ${appName}` : appName),
  resolve: (name) =>
    resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob('./pages/**/*.tsx'),
    ),
  setup({ el, App, props }) {
    const root = createRoot(el);

    root.render(
      <Theme style={{ fontFamily: 'var(--font-sans)' }}>
        <App {...props} />
      </Theme>,
    );
  },
  progress: {
    color: '#4B5563',
  },
});

// This will set light / dark mode on load...
initializeTheme();
