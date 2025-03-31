import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import pluginExternal from 'vite-plugin-external';

export default defineConfig(({}) => {

  return {
    base: 'dist_button',
    plugins: [react(), pluginExternal({
      '@hulk/common': '@hulk/common',
    }),],
    build: {
      outDir: 'dist_button',
      rollupOptions: {
        input: path.resolve(__dirname, 'index.html'),
        // external: ['@hulk/common'],
      },
    },
  }
})