import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    '../resources/js/components/ui/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../resources/js/components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-themes',
  ],
  framework: '@storybook/react-vite',
  viteFinal: (config) => {
    config.server = config.server || {};
    config.server.watch = config.server.watch || {};
    config.server.watch.ignored = ['**/worktrees/**'];
    return config;
  },
};
export default config;
