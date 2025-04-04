import type { StorybookConfig } from '@storybook/react-vite';

import { join, dirname } from "path"

/**
* This function is used to resolve the absolute path of a package.
* It is needed in projects that use Yarn PnP or are set up within a monorepo.
*/
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')))
}
const config: StorybookConfig = {
  "stories": [
    "../packages/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  "staticDirs": [
    '../public'
  ],
  "addons": [
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath("@storybook/experimental-addon-test"),
    getAbsolutePath("@storybook/addon-console"),
  ],
  "framework": {
    "name": getAbsolutePath('@storybook/react-vite'),
    "options": {}
  },
  "viteFinal": (config, { configType }) => {
    const isDev = configType === 'DEVELOPMENT';

    config.resolve ??= {};
    config.resolve.alias ??= {};

    config.resolve.alias['@packages'] = isDev ? join(__dirname, '../packages') : '../packages';
    config.resolve.alias['@'] = isDev ? join(__dirname, '../') : '../';
    config.resolve.alias['@hulk/common'] = isDev ? join(__dirname, '../packages/common') : 'common';

    return config;
  }
};
export default config;