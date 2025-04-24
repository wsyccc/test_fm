import type { StorybookConfig } from '@storybook/react-vite';

import { join, dirname } from "path"
import { mergeConfig } from 'vite';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';

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

    config.worker = {
      format: 'es'
    };

    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.include = [
      ...(config.optimizeDeps.include || []),
      'monaco-yaml/yaml.worker.js',
      'monaco-editor/esm/vs/editor/editor.worker.js'
    ];

    if(!config.plugins){
      config.plugins=[]
    }

    config.plugins.push(
      monacoEditorPlugin({
        customWorkers: [
          {
            label: 'editor',
            entry: 'monaco-editor/esm/vs/editor/editor.worker.js'
          },
          {
            label: 'yaml',
            entry: require.resolve('monaco-yaml/yaml.worker')
          }
        ]
      })
    );

    return mergeConfig(config, {
      resolve: {
        alias: {
          '@packages': isDev ? join(__dirname, '../packages') : '../packages',
          '@': isDev ? join(__dirname, '../') : '../',
          '@hulk/common': isDev ? join(__dirname, '../packages/common') : 'common',
        }
      },
      define: {
        'process.env': {},
      },
      optimizeDeps: {
        include: [
          'monaco-editor/esm/vs/editor/editor.worker.js',
          'monaco-yaml/yaml.worker.js',
        ],
        esbuildOptions: {
          // 确保 worker 文件被正确处理
          loader: {
            '.worker.js': 'js',
          },
        },
      },
      build: {
        rollupOptions: {
          output: {
            // 确保 worker 文件不会被拆包
            manualChunks: {
              monaco: ['monaco-editor', 'monaco-yaml'],
            },
          },
        },
      },
    });

  }
};
export default config;